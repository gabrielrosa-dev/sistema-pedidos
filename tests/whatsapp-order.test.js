const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'assets', 'js', 'app.js'), 'utf8');
const sellerStart = source.indexOf('const whatsappDestinatarios = {');
const sellerEnd = source.indexOf('\nconst appInstallBannerEl', sellerStart);
const start = source.indexOf('async function enviarPedido()');
const end = source.indexOf("\nif (viewOrderButtonEl)", start);
assert.ok(sellerStart >= 0 && sellerEnd > sellerStart);
assert.ok(start >= 0 && end > start);

function createSellerProfile(search = '', savedSeller = '') {
    const values = new Map(savedSeller ? [['run-training-order-seller', savedSeller]] : []);
    const context = {
        window: { location: { search } },
        URLSearchParams,
        localStorage: {
            getItem: key => values.get(key) || null,
            setItem: (key, value) => values.set(key, value)
        }
    };
    vm.createContext(context);
    vm.runInContext(source.slice(sellerStart, sellerEnd), context);
    return { context, values };
}

test('links de cada vendedor direcionam e salvam o perfil para o aplicativo instalado', () => {
    const gabriel = createSellerProfile('?destino=gabriel');
    assert.equal(gabriel.values.get('run-training-order-seller'), 'gabriel');
    assert.equal(gabriel.context.getWhatsAppDestinatario(), '5541995922369');

    const vanderson = createSellerProfile('?destino=vanderson');
    assert.equal(vanderson.values.get('run-training-order-seller'), 'vanderson');
    assert.equal(vanderson.context.getWhatsAppDestinatario(), '554188604367');

    const installedApp = createSellerProfile('', vanderson.values.get('run-training-order-seller'));
    assert.equal(installedApp.context.getWhatsAppDestinatario(), '554188604367');
});

test('sem perfil salvo, mantém Gabriel como destino padrão', () => {
    const profile = createSellerProfile();
    assert.equal(profile.context.getWhatsAppDestinatario(), '5541995922369');
});

function createCheckout({ userAgent, ios = false, destino = '', popupBlocked = false, openFails = false }) {
    const events = [];
    const alerts = [];
    let finishSave;
    const savePromise = new Promise(resolve => { finishSave = resolve; });
    const location = { search: destino ? `?destino=${destino}` : '' };
    Object.defineProperty(location, 'href', {
        set(url) {
            events.push(['navigate', url]);
            if (openFails) throw new Error('protocolo bloqueado');
        }
    });
    const window = {
        location,
        recordAdminSale(record) {
            events.push(['save', record]);
            return savePromise;
        },
        open(url) {
            events.push(['open', url]);
            return popupBlocked ? null : {};
        }
    };
    const context = {
        window, navigator: { userAgent, maxTouchPoints: 5 }, isIOS: ios, URLSearchParams,
        cnpjEl: { value: '12.345.678/0001-90', focus() {} },
        validarCNPJ: () => true,
        razaoSocialAtual: 'Empresa & Filhos',
        razaoSocialConsulta: '12345678000190',
        calculateTotal: () => 300,
        condicaoPagamentoEl: { value: 'Pix' },
        getSelectedProducts: () => [{ name: 'Produto', quantity: 2, price: 150 }],
        formatMoney: value => `R$ ${value}`,
        getWhatsAppDestinatario: () => destino === 'vanderson' ? '554188604367' : '5541995922369',
        getSellerKey: () => destino === 'vanderson' ? 'vanderson' : 'gabriel',
        alert: message => alerts.push(message),
        limparPedido: () => events.push(['clear'])
    };
    vm.createContext(context);
    vm.runInContext(source.slice(start, end), context);
    return { context, events, alerts, finishSave };
}

for (const [name, userAgent, ios, destino] of [
    ['Android Samsung e Vanderson', 'Mozilla/5.0 (Linux; Android 14) SamsungBrowser/26.0', false, 'vanderson'],
    ['iPhone e Gabriel', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)', true, '']
]) {
    test(`${name}: abre o aplicativo no clique sem esperar o registro`, async () => {
        const checkout = createCheckout({ userAgent, ios, destino });
        const sending = checkout.context.enviarPedido();
        assert.deepEqual(checkout.events.map(event => event[0]), ['save', 'navigate']);
        const url = new URL(checkout.events[1][1]);
        assert.equal(url.protocol, 'whatsapp:');
        assert.equal(url.searchParams.get('phone'), destino ? '554188604367' : '5541995922369');
        assert.match(url.searchParams.get('text'), /Empresa & Filhos/);
        assert.equal(checkout.events[0][1].seller_key, destino || 'gabriel');
        checkout.finishSave({ saved: true });
        await sending;
        assert.equal(checkout.events.at(-1)[0], 'clear');
    });
}

test('computador com tela sensível ao toque usa WhatsApp Web', async () => {
    const checkout = createCheckout({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' });
    const sending = checkout.context.enviarPedido();
    assert.deepEqual(checkout.events.map(event => event[0]), ['open', 'save']);
    const url = new URL(checkout.events[0][1]);
    assert.equal(url.origin, 'https://web.whatsapp.com');
    assert.equal(url.searchParams.get('phone'), '5541995922369');
    checkout.finishSave({ saved: true });
    await sending;
});

test('pop-up bloqueado preserva o pedido e não registra venda', async () => {
    const checkout = createCheckout({ userAgent: 'Windows', popupBlocked: true });
    await checkout.context.enviarPedido();
    assert.deepEqual(checkout.events.map(event => event[0]), ['open']);
    assert.match(checkout.alerts[0], /pop-up/);
});

test('falha no histórico mantém o pedido e informa o usuário', async () => {
    const checkout = createCheckout({ userAgent: 'Android' });
    const sending = checkout.context.enviarPedido();
    checkout.finishSave({ saved: false, reason: 'Falha de conexão' });
    await sending;
    assert.deepEqual(checkout.events.map(event => event[0]), ['save', 'navigate']);
    assert.match(checkout.alerts[0], /não foi registrado.*Falha de conexão/);
});

test('erro ao abrir o aplicativo informa se o pedido foi registrado', async () => {
    const checkout = createCheckout({ userAgent: 'Android', openFails: true });
    const sending = checkout.context.enviarPedido();
    checkout.finishSave({ saved: true });
    await sending;
    assert.deepEqual(checkout.events.map(event => event[0]), ['save', 'navigate']);
    assert.match(checkout.alerts[0], /Não foi possível abrir.*registrado no histórico/);
});
