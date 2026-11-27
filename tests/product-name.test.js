const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function createServer(initialRows, imported = false) {
    let rows = initialRows.map(row => [...row]);
    let importActive = imported;
    const sheet = {
        getLastRow: () => rows.length + 1,
        getRange(startRow, startColumn, rowCount = 1, columnCount = 1) {
            return {
                getValues: () => Array.from({ length: rowCount }, (_, index) =>
                    Array.from({ length: columnCount }, (_, column) => rows[startRow - 2 + index]?.[startColumn - 1 + column] ?? '')),
                setValues(values) {
                    for (let index = 0; index < rowCount; index += 1) {
                        const rowIndex = startRow - 2 + index;
                        rows[rowIndex] ||= [];
                        for (let column = 0; column < columnCount; column += 1) {
                            rows[rowIndex][startColumn - 1 + column] = values[index][column];
                        }
                    }
                },
                clearContent() {
                    for (let index = 0; index < rowCount; index += 1) {
                        for (let column = 0; column < columnCount; column += 1) {
                            rows[startRow - 2 + index][startColumn - 1 + column] = '';
                        }
                    }
                }
            };
        }
    };
    const context = {
        LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
        PropertiesService: {
            getScriptProperties: () => ({
                getProperty: () => importActive ? 'true' : null,
                setProperty: () => { importActive = true; }
            })
        }
    };
    vm.createContext(context);
    vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'google-apps-script', 'Code.gs'), 'utf8'), context);
    context.getSessionAdminKey = () => 'admin';
    context.getAvailabilitySheet = () => sheet;
    return { server: context, getRows: () => rows };
}

test('nome editado sobrevive à sincronização, inclusive produtos adicionais', () => {
    const { server, getRows } = createServer([
        [1, 'Produto original', true, 10, 8, 'Descrição anterior', ''],
        [2001, 'Produto extra', true, 20, '', '', '']
    ]);
    server.updateProductName({ token: 'admin', productId: 1, name: '  Novo nome  ' });
    server.updateProductName({ token: 'admin', productId: 2001, name: 'Extra renomeado' });
    const result = server.syncAvailability([{ id: 1, name: 'Produto original' }]);
    assert.equal(result.names['1'], 'Novo nome');
    assert.equal(result.extras[0].name, 'Extra renomeado');
    assert.deepEqual(getRows()[0], [1, 'Novo nome', true, 10, 8, 'Descrição anterior', 'Novo nome']);
    const again = server.syncAvailability([{ id: 1, name: 'Outro nome do catálogo' }]);
    assert.equal(again.catalog[0].name, 'Novo nome');
});

test('catálogo importado usa o nome editado e nova importação usa o nome do PDF', () => {
    const { server, getRows } = createServer([[1, 'Original', true, 10, 8, 'Descrição anterior', '']], true);
    server.updateProductName({ token: 'admin', productId: 1, name: 'Nome editado' });
    assert.equal(server.syncAvailability([{ id: 1, name: 'Original' }]).catalog[0].name, 'Nome editado');
    server.importCatalog({ token: 'admin', products: [{ id: 1, name: 'Nome do PDF', price: 12, available: true }] });
    const result = server.syncAvailability([{ id: 1, name: 'Original' }]);
    assert.equal(result.catalog[0].name, 'Nome do PDF');
    assert.equal(getRows()[0][5], 'Descrição anterior');
    assert.equal(getRows()[0][6], '');
});

test('rejeita nome vazio, fórmula, duplicado e produto inexistente', () => {
    const { server, getRows } = createServer([
        [1, 'Primeiro', true, 10, '', '', ''],
        [2, 'Produto Açúcar', true, 20, '', '', '']
    ]);
    for (const name of ['', '=1+1', 'x'.repeat(251), 'produto acucar']) {
        assert.throws(() => server.updateProductName({ token: 'admin', productId: 1, name }));
    }
    assert.throws(() => server.updateProductName({ token: 'admin', productId: 3, name: 'Outro' }), /não foi encontrado/);
    assert.equal(getRows()[0][1], 'Primeiro');
});

for (const imported of [false, true]) {
    test(`catálogo e promoção exibem o nome salvo (importado: ${imported})`, async () => {
        const source = fs.readFileSync(path.join(__dirname, '..', 'assets', 'js', 'app.js'), 'utf8');
        const start = source.indexOf('async function loadProductAvailability()');
        const end = source.indexOf('\nfunction atualizarPrecoExibido(', start);
        assert.ok(start >= 0 && end > start);
        const products = [{ id: 1, name: 'Original', price: 10, promoPrice: 8, image: 'produto.jpg' }];
        const promotions = [{ productId: 1, name: 'Original' }];
        const context = {
            products,
            promotions,
            hiddenCatalogProductIds: new Set(),
            excludedSoapIds: new Set(),
            REACTIVATED_PRODUCT_IDS: new Set(),
            stockSyncMessageEl: null,
            productSearchEl: null,
            renderPromotionCarousel() {},
            renderProducts() {},
            window: {
                runTrainingSheets: {
                    isConfigured: () => true,
                    syncProductAvailability: async () => ({
                        imported,
                        names: { 1: 'Nome editado' },
                        availability: { 1: true },
                        prices: {},
                        promoPrices: {},
                        extras: [],
                        catalog: [{ id: 1, name: 'Nome editado', price: 10, available: true }]
                    })
                }
            }
        };
        vm.createContext(context);
        vm.runInContext(source.slice(start, end), context);
        await context.loadProductAvailability();
        assert.equal(products[0].name, 'Nome editado');
        assert.equal(promotions[0].name, 'Nome editado');
    });
}

test('painel salva o nome editado e atualiza o produto exibido', async () => {
    const source = fs.readFileSync(path.join(__dirname, '..', 'assets', 'js', 'admin.js'), 'utf8');
    const renderStart = source.indexOf('    function renderInventory()');
    const renderEnd = source.indexOf('    async function updateInventoryProduct(', renderStart);
    const saveStart = source.indexOf('    async function saveProductName(');
    const saveEnd = source.indexOf('    async function saveProductPromotion(', saveStart);
    assert.ok(renderStart >= 0 && renderEnd > renderStart && saveStart >= 0 && saveEnd > saveStart);
    function element(tag = '') {
        return {
            tag, children: [], events: {},
            append(...items) { this.children.push(...items); },
            appendChild(item) { this.children.push(item); },
            replaceChildren(...items) { this.children = items; },
            setAttribute() {},
            addEventListener(event, handler) { this.events[event] = handler; },
            focus() {}
        };
    }
    const list = element();
    const summary = element();
    const inventoryProducts = [{ id: 1, name: 'Original', price: 10, hasPrice: true, available: true }];
    let submitted;
    const context = {
        document: { createElement: element, getElementById: () => summary },
        inventoryList: list,
        inventoryProducts,
        inventorySearch: { value: '' },
        inventoryFilter: { value: 'all' },
        inventoryEmptyState: {},
        inventoryMessage: {},
        setMessage() {},
        sheets: { updateProductName: async (id, name) => { submitted = [id, name]; return { name }; } }
    };
    vm.createContext(context);
    vm.runInContext(source.slice(renderStart, renderEnd) + source.slice(saveStart, saveEnd), context);
    context.renderInventory();
    const [info, actions] = list.children[0].children;
    const nameInput = info.children[2].children[0];
    nameInput.value = 'Novo nome';
    const saveButton = actions.children.find(child => child.textContent === 'Salvar nome');
    await saveButton.events.click();
    assert.deepEqual(submitted, [1, 'Novo nome']);
    assert.equal(inventoryProducts[0].name, 'Novo nome');
    assert.equal(list.children[0].children[0].children[0].textContent, 'Novo nome');
});
