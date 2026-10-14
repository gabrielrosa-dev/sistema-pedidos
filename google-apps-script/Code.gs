const SALES_SHEET_NAME = 'Vendas';
const SALES_HEADERS = [
    'ID',
    'Administrador',
    'CNPJ',
    'Data do envio',
    'Valor da venda',
    'Comissão (5%)',
    'Condição de pagamento',
    'Itens do pedido (JSON)'
];
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
        default:
            throw new Error('Operação desconhecida.');
    }
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
        JSON.stringify(items)
    ];
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
        getSalesSheet().appendRow(row);
    } finally {
        lock.releaseLock();
    }
    return { saved: true };
}

function listSales(payload) {
    const adminKey = getSessionAdminKey(payload.token);
    const filters = payload.filters || {};
    const startDate = filters.startDate ? new Date(String(filters.startDate) + 'T00:00:00-03:00') : null;
    const endDate = filters.endDate ? new Date(String(filters.endDate) + 'T00:00:00-03:00') : null;
    if (endDate) endDate.setUTCDate(endDate.getUTCDate() + 1);
    const search = String(filters.search || '').trim();
    const searchDigits = search.replace(/\D/g, '');
    const pageSize = Math.min(Math.max(Number(payload.pageSize) || 30, 1), 100);
    const page = Math.max(Number(payload.page) || 0, 0);
    const sheet = getSalesSheet();
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return { saleCount: 0, grossTotal: 0, commissionTotal: 0, sales: [] };

    const rows = sheet.getRange(2, 1, lastRow - 1, SALES_HEADERS.length).getValues();
    const matches = rows.filter(row => {
        if (row[1] !== adminKey) return false;
        const soldAt = row[3] instanceof Date ? row[3] : new Date(row[3]);
        if (startDate && soldAt < startDate) return false;
        if (endDate && soldAt >= endDate) return false;
        if (search && (!searchDigits || !String(row[2]).replace(/\D/g, '').includes(searchDigits))) return false;
        return true;
    }).sort((left, right) => new Date(right[3]).getTime() - new Date(left[3]).getTime());

    const grossTotal = matches.reduce((sum, row) => sum + Number(row[4] || 0), 0);
    const commissionTotal = matches.reduce((sum, row) => sum + Number(row[5] || 0), 0);
    const sales = matches.slice(page * pageSize, (page + 1) * pageSize).map(row => ({
        id: String(row[0]),
        cnpj: String(row[2]),
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
        const currentHeadersMatch = SALES_HEADERS.every((header, index) => headers[index] === header);
        const legacyHeadersMatch = LEGACY_SALES_HEADERS.every((header, index) => headers[index] === header);

        if (legacyHeadersMatch) {
            sheet.deleteColumn(3);
        } else if (!currentHeadersMatch) {
            throw new Error('Os cabeçalhos da aba Vendas não correspondem ao formato esperado sem a coluna Razão social. Não alterei a planilha.');
        }
    }

    sheet.getRange(1, 1, 1, SALES_HEADERS.length).setValues([SALES_HEADERS]);
    sheet.setFrozenRows(1);
    sheet.getRange('C:C').setNumberFormat('@');
    sheet.getRange('D:D').setNumberFormat('dd/mm/yyyy hh:mm');
    sheet.getRange('E:F').setNumberFormat('"R$" #,##0.00');
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
