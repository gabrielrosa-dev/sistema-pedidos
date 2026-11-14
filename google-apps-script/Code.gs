const SALES_SHEET_NAME = 'Vendas';
const AVAILABILITY_SHEET_NAME = 'Disponibilidade';
const LEGACY_AVAILABILITY_SHEET_NAME = 'Produtos';
const AVAILABILITY_HEADERS = ['ID', 'Produto', 'Disponível', 'Preço', 'Preço promocional'];
const AVAILABILITY_BASE_HEADERS = ['ID', 'Produto', 'Disponível', 'Preço'];
const LEGACY_AVAILABILITY_HEADERS = ['ID', 'Produto', 'Disponível'];
const CATALOG_IMPORT_ACTIVE_PROPERTY = 'CATALOG_IMPORT_ACTIVE';
const GABRIEL_FCM_TOKEN_PROPERTY = 'GABRIEL_FCM_DEVICE_TOKEN';
const SALES_BASE_HEADERS = [
    'ID',
    'Administrador',
    'CNPJ',
    'Data do envio',
    'Valor da venda',
    'Comissão (5%)',
    'Condição de pagamento',
    'Itens do pedido (JSON)'
];
const SALES_HEADERS = SALES_BASE_HEADERS.concat(['Razão social']);
const LEGACY_SALES_HEADERS = [
    'ID',
    'Administrador',
    'Razão social',
    'CNPJ',
    'Data do envio',
    'Valor da venda',
    'Comissão (5%)',
    'Condição de pagamento',
    'Itens do pedido (JSON)'
];
const SESSION_TTL_SECONDS = 21600;

function onOpen() {
    SpreadsheetApp.getUi()
        .createMenu('Run Training')
        .addItem('Configurar planilha e administradores', 'showSetupSidebar')
        .addToUi();
}

function showSetupSidebar() {
    const sidebar = HtmlService.createHtmlOutputFromFile('Setup')
        .setTitle('Configurar painel administrativo');
    SpreadsheetApp.getUi().showSidebar(sidebar);
}

function saveInitialConfiguration(configuration) {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    if (!spreadsheet) throw new Error('Abra este script a partir da planilha de vendas.');

    const sheet = spreadsheet.getSheetByName(SALES_SHEET_NAME) || spreadsheet.insertSheet(SALES_SHEET_NAME);
    ensureSalesSheetSchema(sheet);

    const gabrielEmail = normalizeEmail(configuration.gabrielEmail);
    const vandersonEmail = normalizeEmail(configuration.vandersonEmail);
    const gabrielPassword = String(configuration.gabrielPassword || '');
    const vandersonPassword = String(configuration.vandersonPassword || '');
    if (!gabrielEmail || !vandersonEmail || gabrielEmail === vandersonEmail) {
        throw new Error('Informe dois e-mails diferentes para os administradores.');
    }
    if (gabrielPassword.length < 10 || vandersonPassword.length < 10) {
        throw new Error('As duas senhas precisam ter pelo menos 10 caracteres.');
    }

    const properties = PropertiesService.getScriptProperties();
    const gabrielSalt = Utilities.getUuid();
    const vandersonSalt = Utilities.getUuid();
    properties.setProperties({
        SPREADSHEET_ID: spreadsheet.getId(),
        GABRIEL_EMAIL: gabrielEmail,
        GABRIEL_PASSWORD_SALT: gabrielSalt,
        GABRIEL_PASSWORD_HASH: hashPassword(gabrielPassword, gabrielSalt),
        VANDERSON_EMAIL: vandersonEmail,
        VANDERSON_PASSWORD_SALT: vandersonSalt,
        VANDERSON_PASSWORD_HASH: hashPassword(vandersonPassword, vandersonSalt)
    });
    return 'Planilha e acessos configurados. Agora publique este projeto como um Web App.';
}

function doGet() {
    return HtmlService.createHtmlOutput(
        '<!doctype html><html lang="pt-BR"><meta charset="utf-8"><body>' +
        '<h1>Integração Run Training ativa</h1>' +
        '<p>O Web App está publicado e pronto para receber solicitações do painel.</p>' +
        '</body></html>'
    ).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(event) {
    let requestId = '';
    let response;
    try {
        const parameters = event && event.parameter ? event.parameter : {};
        requestId = String(parameters.requestId || '');
        const payload = JSON.parse(parameters.payload || '{}');
        response = {
            ok: true,
            data: handleRequest(String(parameters.operation || ''), payload)
        };
    } catch (error) {
        response = {
            ok: false,
            error: error && error.message ? error.message : 'Não foi possível processar a solicitação.'
        };
    }

    const message = JSON.stringify({ channel: 'run-training-sheets', requestId: requestId, response: response })
        .replace(/</g, '\\u003c');
    return HtmlService.createHtmlOutput(
        '<!doctype html><html><body><script>window.top.postMessage(' + message + ',"*");</script></body></html>'
    ).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function handleRequest(operation, payload) {
    switch (operation) {
        case 'login':
            return loginAdmin(payload);
        case 'session':
            return getAdminSession(payload.token);
        case 'logout':
            CacheService.getScriptCache().remove(sessionCacheKey(payload.token));
            return { signedOut: true };
        case 'recordSale':
            return recordSale(payload);
        case 'sales':
            return listSales(payload);
        case 'updateSaleTotal':
            return updateSaleTotal(payload);
        case 'deleteSale':
            return deleteSale(payload);
        case 'syncAvailability':
            return syncAvailability(payload.products);
        case 'availability':
            return listAvailability(payload.token);
        case 'updateProductAvailability':
            return updateProductAvailability(payload);
        case 'importCatalog':
            return importCatalog(payload);
        case 'addProduct':
            return addProduct(payload);
        case 'updateProductPromotion':
            return updateProductPromotion(payload);
        case 'updateSale':
            return updateSale(payload);
        case 'lookupCnpj':
            return { name: lookupCompanyName(payload.cnpj) };
        case 'registerNotificationDevice':
            return registerNotificationDevice(payload);
        default:
            throw new Error('Operação desconhecida.');
    }
}

function syncAvailability(products) {
    if (!Array.isArray(products) || products.length > 1000) {
        throw new Error('A lista de produtos enviada pelo catálogo é inválida.');
    }

    const normalizedProducts = products.map(product => {
        const id = Number(product.id);
        const name = String(product.name || '').trim();
        if (!Number.isSafeInteger(id) || id < 1 || !name || name.length > 250) {
            throw new Error('A lista de produtos contém dados inválidos.');
        }
        return {
            id: id,
            name: name,
            forceUnavailable: product.forceUnavailable === true
        };
    });
    if (new Set(normalizedProducts.map(product => product.id)).size !== normalizedProducts.length) {
        throw new Error('A lista de produtos contém identificadores repetidos.');
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
        const sheet = getAvailabilitySheet();
        const lastRow = sheet.getLastRow();
        const existingRows = lastRow > 1
            ? sheet.getRange(2, 1, lastRow - 1, AVAILABILITY_HEADERS.length).getValues()
            : [];
        const rowById = new Map(existingRows.map(row => [Number(row[0]), {
            name: String(row[1] || ''),
            available: row[2] !== false,
            price: normalizeAvailabilityPrice(row[3]),
            promoPrice: normalizePromoPrice(row[4])
        }]));
        const importedCatalogActive = PropertiesService.getScriptProperties()
            .getProperty(CATALOG_IMPORT_ACTIVE_PROPERTY) === 'true';
        const rows = [];
        const extraRows = [];
        normalizedProducts.forEach(product => {
            const existing = rowById.get(product.id);
            if (importedCatalogActive && !existing) return;
            rowById.delete(product.id);
            const price = existing ? existing.price : null;
            const available = product.forceUnavailable && price === null
                ? false
                : existing ? existing.available : true;
            rows.push([
                product.id,
                importedCatalogActive && existing.name ? existing.name : product.name,
                available,
                price,
                existing ? existing.promoPrice : null
            ]);
        });
        existingRows.forEach(row => {
            const id = Number(row[0]);
            if (rowById.has(id)) {
                const kept = [id, String(row[1]), row[2] !== false, normalizeAvailabilityPrice(row[3]), normalizePromoPrice(row[4])];
                rows.push(kept);
                extraRows.push(kept);
                rowById.delete(id);
            }
        });

        if (lastRow > 1) sheet.getRange(2, 1, lastRow - 1, AVAILABILITY_HEADERS.length).clearContent();
        if (rows.length) sheet.getRange(2, 1, rows.length, AVAILABILITY_HEADERS.length).setValues(rows);
        return {
            availability: Object.fromEntries(rows.map(row => [String(row[0]), row[2]])),
            prices: Object.fromEntries(rows.filter(row => row[3] !== null).map(row => [String(row[0]), row[3]])),
            promoPrices: Object.fromEntries(rows.filter(row => row[4] !== null).map(row => [String(row[0]), row[4]])),
            catalog: rows.map(toCatalogEntry),
            extras: extraRows.map(toCatalogEntry),
            imported: importedCatalogActive
        };
    } finally {
        lock.releaseLock();
    }
}

function toCatalogEntry(row) {
    return {
        id: row[0],
        name: row[1],
        available: row[2],
        price: normalizeAvailabilityPrice(row[3]),
        promoPrice: normalizePromoPrice(row[4])
    };
}

function importCatalog(payload) {
    getSessionAdminKey(payload.token);
    if (!Array.isArray(payload.products) || payload.products.length === 0 || payload.products.length > 900) {
        throw new Error('A lista importada está vazia ou excede o limite de produtos.');
    }

    const products = payload.products.map(product => {
        const id = Number(product.id);
        const name = String(product.name || '').trim();
        const price = Number(product.price);
        if (!Number.isSafeInteger(id) || id < 1 || !name || name.length > 250
            || !Number.isFinite(price) || price <= 0 || price > 1000000000
            || typeof product.available !== 'boolean') {
            throw new Error('A lista importada contém produto, preço ou disponibilidade inválidos.');
        }
        return {
            id: id,
            name: name,
            available: product.available,
            price: Math.round((price + Number.EPSILON) * 100) / 100
        };
    });
    if (new Set(products.map(product => product.id)).size !== products.length) {
        throw new Error('A lista importada contém códigos de produto repetidos.');
    }
    const normalizedNames = products.map(product => product.name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, ''));
    if (new Set(normalizedNames).size !== products.length) {
        throw new Error('A lista importada contém produtos com nomes repetidos.');
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
        const sheet = getAvailabilitySheet();
        const previousPromos = new Map();
        const lastRow = sheet.getLastRow();
        if (lastRow > 1) {
            sheet.getRange(2, 1, lastRow - 1, AVAILABILITY_HEADERS.length).getValues()
                .forEach(row => previousPromos.set(Number(row[0]), normalizePromoPrice(row[4])));
        }
        const rows = products.map(product => [
            product.id,
            product.name,
            product.available,
            product.price,
            previousPromos.has(product.id) ? previousPromos.get(product.id) : null
        ]);
        if (lastRow > 1) sheet.getRange(2, 1, lastRow - 1, AVAILABILITY_HEADERS.length).clearContent();
        sheet.getRange(2, 1, rows.length, AVAILABILITY_HEADERS.length).setValues(rows);
        PropertiesService.getScriptProperties().setProperty(CATALOG_IMPORT_ACTIVE_PROPERTY, 'true');
    } finally {
        lock.releaseLock();
    }
    return { importedCount: products.length };
}

function listAvailability(token) {
    getSessionAdminKey(token);
    const sheet = getAvailabilitySheet();
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return [];
    return sheet.getRange(2, 1, lastRow - 1, AVAILABILITY_HEADERS.length).getValues()
        .filter(row => Number.isSafeInteger(Number(row[0])) && String(row[1]).trim())
        .map(row => toCatalogEntry([Number(row[0]), String(row[1]), row[2] !== false, row[3], row[4]]))
        .sort((first, second) => first.name.localeCompare(second.name, 'pt-BR'));
}

function updateProductAvailability(payload) {
    getSessionAdminKey(payload.token);
    const productId = Number(payload.productId);
    if (!Number.isSafeInteger(productId) || productId < 1 || typeof payload.available !== 'boolean') {
        throw new Error('A disponibilidade informada é inválida.');
    }
    const priceProvided = payload.price !== undefined && payload.price !== null && String(payload.price).trim() !== '';
    const submittedPrice = priceProvided ? Number(payload.price) : null;
    const price = submittedPrice === null
        ? null
        : Math.round((submittedPrice + Number.EPSILON) * 100) / 100;
    if (priceProvided && (!Number.isFinite(price) || price <= 0 || price > 1000000000)) {
        throw new Error('Informe um preço válido maior que zero.');
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
        const sheet = getAvailabilitySheet();
        const lastRow = sheet.getLastRow();
        if (lastRow < 2) throw new Error('O catálogo ainda não foi sincronizado.');
        const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
        const rowIndex = ids.findIndex(row => Number(row[0]) === productId);
        if (rowIndex === -1) throw new Error('O produto não foi encontrado. Atualize o catálogo e tente novamente.');
        const rowNumber = rowIndex + 2;
        const currentPrice = normalizeAvailabilityPrice(sheet.getRange(rowNumber, 4).getValues()[0][0]);
        const savedPrice = priceProvided ? price : currentPrice;
        if (payload.available && savedPrice === null) {
            throw new Error('Informe e salve um preço antes de marcar o produto como disponível.');
        }
        sheet.getRange(rowNumber, 3, 1, 2).setValues([[
            payload.available,
            priceProvided ? price : currentPrice
        ]]);
        return { productId: productId, available: payload.available, price: savedPrice };
    } finally {
        lock.releaseLock();
    }
}

function getAvailabilitySheet() {
    const spreadsheetId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
    if (!spreadsheetId) throw new Error('Configure primeiro a planilha de vendas.');
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    let sheet = spreadsheet.getSheetByName(AVAILABILITY_SHEET_NAME);
    if (!sheet) {
        sheet = spreadsheet.getSheetByName(LEGACY_AVAILABILITY_SHEET_NAME);
        if (sheet) {
            sheet.setName(AVAILABILITY_SHEET_NAME);
        } else {
            sheet = spreadsheet.insertSheet(AVAILABILITY_SHEET_NAME);
        }
    }
    if (sheet.getLastRow() === 0) {
        sheet.getRange(1, 1, 1, AVAILABILITY_HEADERS.length).setValues([AVAILABILITY_HEADERS]);
        sheet.setFrozenRows(1);
        sheet.autoResizeColumns(1, AVAILABILITY_HEADERS.length);
    } else {
        const headers = sheet.getRange(1, 1, 1, AVAILABILITY_HEADERS.length).getDisplayValues()[0];
        const hasBaseHeaders = AVAILABILITY_BASE_HEADERS.every((header, index) => headers[index] === header);
        const hasLegacyHeaders = LEGACY_AVAILABILITY_HEADERS.every((header, index) => headers[index] === header);
        if (hasLegacyHeaders && !headers[3]) {
            sheet.getRange(1, 4).setValue(AVAILABILITY_HEADERS[3]);
        } else if (!hasBaseHeaders) {
            throw new Error('Os cabeçalhos da aba Disponibilidade não correspondem ao formato esperado.');
        }
        if (!headers[4]) sheet.getRange(1, 5).setValue(AVAILABILITY_HEADERS[4]);
    }
    return sheet;
}

// Vazio = usa a promoção padrão do catálogo; 0 = promoção removida; maior que zero = preço promocional.
function normalizePromoPrice(value) {
    if (value === null || value === undefined || String(value).trim() === '') return null;
    const price = Number(value);
    return Number.isFinite(price) && price >= 0 ? Math.round((price + Number.EPSILON) * 100) / 100 : null;
}

function updateProductPromotion(payload) {
    getSessionAdminKey(payload.token);
    const productId = Number(payload.productId);
    const promoPrice = Number(payload.promoPrice);
    if (!Number.isSafeInteger(productId) || productId < 1 || !Number.isFinite(promoPrice)
        || promoPrice < 0 || promoPrice > 1000000000) {
        throw new Error('O preço promocional informado é inválido.');
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
        const sheet = getAvailabilitySheet();
        const lastRow = sheet.getLastRow();
        if (lastRow < 2) throw new Error('O catálogo ainda não foi sincronizado.');
        const rows = sheet.getRange(2, 1, lastRow - 1, 4).getValues();
        const rowIndex = rows.findIndex(row => Number(row[0]) === productId);
        if (rowIndex === -1) throw new Error('O produto não foi encontrado. Atualize o catálogo e tente novamente.');
        const price = normalizeAvailabilityPrice(rows[rowIndex][3]);
        const saved = Math.round((promoPrice + Number.EPSILON) * 100) / 100;
        if (saved > 0 && payload.catalogPrice == null && price === null) {
            throw new Error('Cadastre o preço do produto antes de criar a promoção.');
        }
        const basePrice = price !== null ? price : Number(payload.catalogPrice);
        if (saved > 0 && (!Number.isFinite(basePrice) || saved >= basePrice)) {
            throw new Error('O preço promocional precisa ser menor que o preço normal.');
        }
        sheet.getRange(rowIndex + 2, 5).setValue(saved);
        return { productId: productId, promoPrice: saved };
    } finally {
        lock.releaseLock();
    }
}

function addProduct(payload) {
    getSessionAdminKey(payload.token);
    const name = String(payload.name || '').trim();
    const price = Number(payload.price);
    if (!name || name.length > 250) throw new Error('Informe o nome do produto (até 250 caracteres).');
    if (!Number.isFinite(price) || price <= 0 || price > 1000000000) throw new Error('Informe um preço válido maior que zero.');
    const roundedPrice = Math.round((price + Number.EPSILON) * 100) / 100;
    const normalizeName = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .toLowerCase().replace(/[^a-z0-9]/g, '');

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
        const sheet = getAvailabilitySheet();
        const lastRow = sheet.getLastRow();
        const rows = lastRow > 1 ? sheet.getRange(2, 1, lastRow - 1, 2).getValues() : [];
        if (rows.length >= 900) throw new Error('O catálogo atingiu o limite de produtos.');
        if (rows.some(row => normalizeName(row[1]) === normalizeName(name))) {
            throw new Error('Já existe um produto com esse nome.');
        }
        const id = Math.max(2000, ...rows.map(row => Number(row[0]) || 0)) + 1;
        sheet.appendRow([id, name, true, roundedPrice, '']);
        return { id: id, name: name, price: roundedPrice, available: true };
    } finally {
        lock.releaseLock();
    }
}

function normalizeAvailabilityPrice(value) {
    if (value === null || value === undefined || String(value).trim() === '') return null;
    const price = Number(value);
    return Number.isFinite(price) && price > 0 ? Math.round((price + Number.EPSILON) * 100) / 100 : null;
}

function loginAdmin(payload) {
    const properties = PropertiesService.getScriptProperties();
    const email = normalizeEmail(payload.email);
    const attemptsKey = 'login-attempts-' + hashPassword(email).slice(0, 24);
    const cache = CacheService.getScriptCache();
    const attempts = Number(cache.get(attemptsKey) || 0);
    if (attempts >= 8) throw new Error('Muitas tentativas. Aguarde 10 minutos e tente novamente.');

    const administrators = [
        { key: 'gabriel', name: 'Gabriel', email: properties.getProperty('GABRIEL_EMAIL'), passwordSalt: properties.getProperty('GABRIEL_PASSWORD_SALT'), passwordHash: properties.getProperty('GABRIEL_PASSWORD_HASH') },
        { key: 'vanderson', name: 'Vanderson', email: properties.getProperty('VANDERSON_EMAIL'), passwordSalt: properties.getProperty('VANDERSON_PASSWORD_SALT'), passwordHash: properties.getProperty('VANDERSON_PASSWORD_HASH') }
    ];
    const administrator = administrators.find(item => item.email && item.email === email);
    if (!administrator || administrator.passwordHash !== hashPassword(String(payload.password || ''), administrator.passwordSalt)) {
        cache.put(attemptsKey, String(attempts + 1), 600);
        throw new Error('E-mail ou senha incorretos.');
    }
    cache.remove(attemptsKey);

    const token = Utilities.getUuid() + Utilities.getUuid().replace(/-/g, '');
    cache.put(sessionCacheKey(token), administrator.key, SESSION_TTL_SECONDS);
    return { token: token, adminKey: administrator.key, displayName: administrator.name };
}

function getAdminSession(token) {
    const adminKey = getSessionAdminKey(token);
    return { adminKey: adminKey, displayName: adminKey === 'gabriel' ? 'Gabriel' : 'Vanderson' };
}

function recordSale(sale) {
    const sellerKey = String(sale.seller_key || '');
    if (sellerKey !== 'gabriel' && sellerKey !== 'vanderson') throw new Error('Administrador da venda inválido.');
    const cnpj = String(sale.cnpj || '').trim();
    const digits = cnpj.replace(/\D/g, '');
    const total = Number(sale.total);
    const paymentCondition = String(sale.payment_condition || '').trim();
    const items = Array.isArray(sale.items) ? sale.items : null;

    if (digits.length !== 14) throw new Error('O CNPJ precisa conter 14 dígitos.');
    if (!Number.isFinite(total) || total < 300) throw new Error('O pedido não atingiu o valor mínimo de R$ 300,00.');
    if (!paymentCondition || paymentCondition.length > 80) throw new Error('Condição de pagamento inválida.');
    if (!items || items.length === 0 || items.length > 500) throw new Error('Os itens do pedido são inválidos.');

    const companyName = lookupCompanyName(digits);
    if (!companyName) {
        throw new Error('Não foi possível carregar a razão social deste CNPJ. Confira o número e tente novamente mais tarde.');
    }

    const now = new Date();
    const commission = Math.round((total + Number.EPSILON) * 5) / 100;
    const row = [
        Utilities.getUuid(),
        sellerKey,
        cnpj,
        now,
        total,
        commission,
        paymentCondition,
        JSON.stringify(items),
        companyName
    ];
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
        getSalesSheet().appendRow(row);
    } finally {
        lock.releaseLock();
    }

    if (sellerKey !== 'gabriel') return { saved: true, notificationSent: false };
    try {
        sendGabrielSaleNotification(companyName, total);
        return { saved: true, notificationSent: true };
    } catch (error) {
        return {
            saved: true,
            notificationSent: false,
            notificationError: error && error.message ? error.message : 'Falha ao enviar a notificação push.'
        };
    }
}

function registerNotificationDevice(payload) {
    if (getSessionAdminKey(payload.token) !== 'gabriel') {
        throw new Error('Somente o administrador Gabriel pode registrar o aparelho das notificações.');
    }
    const token = String(payload.deviceToken || '').trim();
    if (token.length < 50 || token.length > 4096) {
        throw new Error('O token de notificações deste aparelho é inválido.');
    }
    PropertiesService.getScriptProperties().setProperty(GABRIEL_FCM_TOKEN_PROPERTY, token);
    return { registered: true };
}

function sendGabrielSaleNotification(companyName, total) {
    const properties = PropertiesService.getScriptProperties();
    const projectId = properties.getProperty('FCM_PROJECT_ID');
    const deviceToken = properties.getProperty(GABRIEL_FCM_TOKEN_PROPERTY);
    if (!projectId || !deviceToken) {
        throw new Error('Notificação não configurada: registre o aparelho privado no painel do Gabriel e configure o Firebase. Consulte o README.');
    }

    const accessToken = getFirebaseAccessToken(properties);
    const amount = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total);
    const response = UrlFetchApp.fetch(
        'https://fcm.googleapis.com/v1/projects/' + encodeURIComponent(projectId) + '/messages:send',
        {
            method: 'post',
            contentType: 'application/json',
            headers: { Authorization: 'Bearer ' + accessToken },
            payload: JSON.stringify({
                message: {
                    token: deviceToken,
                    notification: {
                        title: 'Nova venda do Gabriel',
                        body: String(companyName) + ' • ' + amount
                    },
                    data: { companyName: String(companyName), total: String(total) }
                }
            }),
            muteHttpExceptions: true
        }
    );
    if (response.getResponseCode() !== 200) {
        throw new Error('O Firebase não aceitou a notificação (HTTP ' + response.getResponseCode() + '). Verifique a configuração do projeto e do aparelho.');
    }
}

function getFirebaseAccessToken(properties) {
    const cache = CacheService.getScriptCache();
    const cachedToken = cache.get('firebase-access-token');
    if (cachedToken) return cachedToken;

    const clientEmail = properties.getProperty('FCM_SERVICE_ACCOUNT_EMAIL');
    const privateKey = String(properties.getProperty('FCM_SERVICE_ACCOUNT_PRIVATE_KEY') || '').replace(/\\n/g, '\n');
    if (!clientEmail || !privateKey) {
        throw new Error('Notificação não configurada: informe o e-mail e a chave privada da conta de serviço Firebase nas propriedades do Apps Script.');
    }

    const now = Math.floor(Date.now() / 1000);
    const encode = value => Utilities.base64EncodeWebSafe(value).replace(/=+$/g, '');
    const unsignedToken = [
        encode(JSON.stringify({ alg: 'RS256', typ: 'JWT' })),
        encode(JSON.stringify({
            iss: clientEmail,
            scope: 'https://www.googleapis.com/auth/firebase.messaging',
            aud: 'https://oauth2.googleapis.com/token',
            iat: now,
            exp: now + 3600
        }))
    ].join('.');
    const signature = Utilities.computeRsaSignature(
        Utilities.RsaAlgorithm.SHA_256,
        unsignedToken,
        privateKey
    );
    const assertion = unsignedToken + '.' + encode(signature);
    const response = UrlFetchApp.fetch('https://oauth2.googleapis.com/token', {
        method: 'post',
        payload: {
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: assertion
        },
        muteHttpExceptions: true
    });
    if (response.getResponseCode() !== 200) {
        throw new Error('Não foi possível autenticar no Firebase. Confira as credenciais da conta de serviço.');
    }

    const result = JSON.parse(response.getContentText());
    if (!result.access_token || !Number(result.expires_in)) {
        throw new Error('O Firebase retornou uma credencial de acesso inválida.');
    }
    cache.put('firebase-access-token', result.access_token, Math.max(1, Math.min(Number(result.expires_in) - 60, 3500)));
    return result.access_token;
}

function listSales(payload) {
    const adminKey = getSessionAdminKey(payload.token);
    const filters = payload.filters || {};
    const startDate = filters.startDate ? new Date(String(filters.startDate) + 'T00:00:00-03:00') : null;
    const endDate = filters.endDate ? new Date(String(filters.endDate) + 'T00:00:00-03:00') : null;
    if (endDate) endDate.setUTCDate(endDate.getUTCDate() + 1);
    const search = String(filters.search || '').trim();
    const searchDigits = search.replace(/\D/g, '');
    const pageSize = Math.min(Math.max(Number(payload.pageSize) || 10, 1), 100);
    const page = Math.max(Number(payload.page) || 0, 0);
    const sheet = getSalesSheet();
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return { saleCount: 0, grossTotal: 0, commissionTotal: 0, sales: [] };

    const rows = sheet.getRange(2, 1, lastRow - 1, SALES_HEADERS.length).getValues();
    rows.forEach((row, index) => { row.rowNumber = index + 2; });
    const matches = rows.filter(row => {
        if (row[1] !== adminKey) return false;
        const soldAt = row[3] instanceof Date ? row[3] : new Date(row[3]);
        if (startDate && soldAt < startDate) return false;
        if (endDate && soldAt >= endDate) return false;
        if (search) {
            const matchesCnpj = searchDigits && String(row[2]).replace(/\D/g, '').includes(searchDigits);
            const matchesName = normalizeSearchText(row[8]).includes(normalizeSearchText(search));
            if (!matchesCnpj && !matchesName) return false;
        }
        return true;
    }).sort((left, right) => new Date(right[3]).getTime() - new Date(left[3]).getTime());

    const grossTotal = matches.reduce((sum, row) => sum + Number(row[4] || 0), 0);
    const commissionTotal = matches.reduce((sum, row) => sum + Number(row[5] || 0), 0);
    const pageRows = matches.slice(page * pageSize, (page + 1) * pageSize);
    fillMissingCompanyNames(sheet, rows, pageRows);
    const sales = pageRows.map(row => ({
        id: String(row[0]),
        cnpj: String(row[2]),
        companyName: String(row[8] || ''),
        soldAt: (row[3] instanceof Date ? row[3] : new Date(row[3])).toISOString(),
        total: Number(row[4]),
        commission: Number(row[5]),
        paymentCondition: String(row[6] || ''),
        items: parseSaleItems(row[7], row[0])
    }));
    return {
        saleCount: matches.length,
        grossTotal: Math.round((grossTotal + Number.EPSILON) * 100) / 100,
        commissionTotal: Math.round((commissionTotal + Number.EPSILON) * 100) / 100,
        sales: sales
    };
}

function normalizeSearchText(value) {
    return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

function lookupCompanyName(cnpj) {
    const digits = String(cnpj || '').replace(/\D/g, '');
    if (digits.length !== 14) throw new Error('O CNPJ precisa conter 14 dígitos.');
    const cache = CacheService.getScriptCache();
    const hitKey = 'cnpj-name-' + digits;
    const cached = cache.get(hitKey);
    if (cached) return cached;
    if (cache.get('cnpj-miss-' + digits)) return '';

    const sources = [
        { url: 'https://brasilapi.com.br/api/cnpj/v1/' + digits, field: 'razao_social' },
        { url: 'https://receitaws.com.br/v1/cnpj/' + digits, field: 'nome' }
    ];
    for (let index = 0; index < sources.length; index += 1) {
        try {
            const response = UrlFetchApp.fetch(sources[index].url, { muteHttpExceptions: true });
            if (response.getResponseCode() !== 200) continue;
            const name = String(JSON.parse(response.getContentText())[sources[index].field] || '').trim();
            if (name) {
                cache.put(hitKey, name.slice(0, 250), 21600);
                return name.slice(0, 250);
            }
        } catch (error) {
            // tenta a próxima fonte
        }
    }
    cache.put('cnpj-miss-' + digits, '1', 600);
    return '';
}

function fillMissingCompanyNames(sheet, allRows, pageRows) {
    const knownNames = new Map();
    allRows.forEach(row => {
        const digits = String(row[2]).replace(/\D/g, '');
        if (row[8] && digits) knownNames.set(digits, String(row[8]));
    });
    const startedAt = Date.now();
    pageRows.forEach(row => {
        if (row[8]) return;
        const digits = String(row[2]).replace(/\D/g, '');
        if (digits.length !== 14) return;
        let name = knownNames.get(digits) || '';
        if (!name && Date.now() - startedAt < 20000) {
            try {
                name = lookupCompanyName(digits);
            } catch (error) {
                name = '';
            }
        }
        if (!name) return;
        knownNames.set(digits, name);
        const lock = LockService.getScriptLock();
        lock.waitLock(10000);
        try {
            if (String(sheet.getRange(row.rowNumber, 1).getValue()) === String(row[0])) {
                sheet.getRange(row.rowNumber, 9).setValue(name);
                row[8] = name;
            }
        } finally {
            lock.releaseLock();
        }
    });
}

function updateSale(payload) {
    const adminKey = getSessionAdminKey(payload.token);
    const saleId = String(payload.saleId || '').trim();
    if (!saleId) throw new Error('Pedido inválido.');
    if (!Array.isArray(payload.items) || payload.items.length === 0 || payload.items.length > 500) {
        throw new Error('O pedido precisa ter entre 1 e 500 itens.');
    }
    const items = payload.items.map((item, index) => {
        const name = String(item && item.name || '').trim();
        const quantity = Number(item && item.quantity);
        const unitPrice = Number(item && item.unit_price);
        if (!name || name.length > 250 || !Number.isFinite(quantity) || quantity <= 0 || quantity > 1000000
            || !Number.isFinite(unitPrice) || unitPrice < 0 || unitPrice > 1000000000) {
            throw new Error('O item ' + (index + 1) + ' contém dados inválidos.');
        }
        return {
            name: name,
            quantity: quantity,
            unit_price: Math.round((unitPrice + Number.EPSILON) * 100) / 100,
            variant: item.variant ? String(item.variant).slice(0, 250) : null
        };
    });
    const rawTotal = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
    const total = Math.round((rawTotal + Number.EPSILON) * 100) / 100;
    if (total < 300 || total > 1000000000) {
        throw new Error('O valor do pedido precisa estar entre R$ 300,00 e R$ 1.000.000.000,00.');
    }
    const paymentCondition = payload.paymentCondition === undefined
        ? null
        : String(payload.paymentCondition).trim();
    if (paymentCondition !== null && (!paymentCondition || paymentCondition.length > 80)) {
        throw new Error('Condição de pagamento inválida.');
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
        const sheet = getSalesSheet();
        const rowNumber = findAdminSaleRow(sheet, saleId, adminKey);
        const commission = Math.round((total + Number.EPSILON) * 5) / 100;
        sheet.getRange(rowNumber, 5, 1, 2).setValues([[total, commission]]);
        if (paymentCondition !== null) sheet.getRange(rowNumber, 7).setValue(paymentCondition);
        sheet.getRange(rowNumber, 8).setValue(JSON.stringify(items));
    } finally {
        lock.releaseLock();
    }
    return { updated: true, total: total, commission: Math.round((total + Number.EPSILON) * 5) / 100 };
}

function updateSaleTotal(payload) {
    const adminKey = getSessionAdminKey(payload.token);
    const saleId = String(payload.saleId || '').trim();
    const total = Number(payload.total);
    if (!saleId) throw new Error('Pedido inválido.');
    if (!Number.isFinite(total) || total < 300 || total > 1000000000) {
        throw new Error('Informe um valor entre R$ 300,00 e R$ 1.000.000.000,00.');
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
        const sheet = getSalesSheet();
        const rowNumber = findAdminSaleRow(sheet, saleId, adminKey);
        const commission = Math.round((total + Number.EPSILON) * 5) / 100;
        sheet.getRange(rowNumber, 5, 1, 2).setValues([[total, commission]]);
    } finally {
        lock.releaseLock();
    }
    return { updated: true };
}

function deleteSale(payload) {
    const adminKey = getSessionAdminKey(payload.token);
    const saleId = String(payload.saleId || '').trim();
    if (!saleId) throw new Error('Pedido inválido.');

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
        const sheet = getSalesSheet();
        const rowNumber = findAdminSaleRow(sheet, saleId, adminKey);
        sheet.deleteRow(rowNumber);
    } finally {
        lock.releaseLock();
    }
    return { deleted: true };
}

function findAdminSaleRow(sheet, saleId, adminKey) {
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) throw new Error('O pedido não foi encontrado.');
    const rows = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
    const rowIndex = rows.findIndex(row => String(row[0]) === saleId && row[1] === adminKey);
    if (rowIndex === -1) throw new Error('O pedido não foi encontrado na sua conta administrativa.');
    return rowIndex + 2;
}

function parseSaleItems(value, saleId) {
    let items;
    try {
        items = JSON.parse(String(value || '[]'));
    } catch (error) {
        throw new Error('Os itens do pedido ' + saleId + ' estão em formato inválido.');
    }
    if (!Array.isArray(items)) throw new Error('Os itens do pedido ' + saleId + ' estão em formato inválido.');
    return items.map((item, index) => {
        const name = String(item && item.name || '');
        const quantity = Number(item && item.quantity);
        const unitPrice = Number(item && item.unit_price);
        if (!name || !Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(unitPrice) || unitPrice < 0) {
            throw new Error('O item ' + (index + 1) + ' do pedido ' + saleId + ' contém dados inválidos.');
        }
        return {
            name: name,
            quantity: quantity,
            unitPrice: unitPrice,
            variant: item.variant ? String(item.variant) : ''
        };
    });
}

function getSalesSheet() {
    const spreadsheetId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
    if (!spreadsheetId) throw new Error('Configure primeiro a planilha de vendas.');
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheet = spreadsheet.getSheetByName(SALES_SHEET_NAME);
    if (!sheet) throw new Error('A aba Vendas não foi encontrada na planilha.');
    ensureSalesSheetSchema(sheet);
    return sheet;
}

function ensureSalesSheetSchema(sheet) {
    if (sheet.getLastRow() === 0) {
        sheet.getRange(1, 1, 1, SALES_HEADERS.length).setValues([SALES_HEADERS]);
    } else {
        const headers = sheet.getRange(1, 1, 1, LEGACY_SALES_HEADERS.length).getDisplayValues()[0];
        const currentHeadersMatch = SALES_BASE_HEADERS.every((header, index) => headers[index] === header);
        const legacyHeadersMatch = LEGACY_SALES_HEADERS.every((header, index) => headers[index] === header);

        if (legacyHeadersMatch) {
            sheet.deleteColumn(3);
        } else if (!currentHeadersMatch) {
            throw new Error('Os cabeçalhos da aba Vendas não correspondem ao formato esperado sem a coluna Razão social. Não alterei a planilha.');
        }
    }

    if (sheet.getMaxColumns() < SALES_HEADERS.length) {
        sheet.insertColumnsAfter(sheet.getMaxColumns(), SALES_HEADERS.length - sheet.getMaxColumns());
    }
    sheet.getRange(1, 1, 1, SALES_HEADERS.length).setValues([SALES_HEADERS]);
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, SALES_HEADERS.length);
}

function getSessionAdminKey(token) {
    if (!token) throw new Error('Sua sessão expirou. Entre novamente.');
    const adminKey = CacheService.getScriptCache().get(sessionCacheKey(token));
    if (adminKey !== 'gabriel' && adminKey !== 'vanderson') {
        throw new Error('Sua sessão expirou. Entre novamente.');
    }
    return adminKey;
}

function sessionCacheKey(token) {
    return 'admin-session-' + hashPassword(String(token)).slice(0, 40);
}

function hashPassword(password, salt) {
    const bytes = Utilities.computeDigest(
        Utilities.DigestAlgorithm.SHA_256,
        String(salt || '') + String(password),
        Utilities.Charset.UTF_8
    );
    return bytes.map(value => {
        const normalized = (value + 256) % 256;
        return ('0' + normalized.toString(16)).slice(-2);
    }).join('');
}

function normalizeEmail(value) {
    return String(value || '').trim().toLowerCase();
}
