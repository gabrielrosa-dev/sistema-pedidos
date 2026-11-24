const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'assets', 'js', 'sheets-client.js'), 'utf8');

function createClient() {
    let messageHandler;
    let submittedForm;
    const window = {
        RUN_TRAINING_SHEETS_CONFIG: { webAppUrl: 'https://script.google.com/example' },
        addEventListener: (type, handler) => { messageHandler = handler; },
        removeEventListener: () => { messageHandler = null; },
        setTimeout: () => 1,
        clearTimeout: () => {}
    };
    const document = {
        createElement(tag) {
            return {
                children: [],
                appendChild(child) { this.children.push(child); },
                remove() {},
                submit() { submittedForm = this; }
            };
        },
        body: { append() {} }
    };
    vm.runInNewContext(source, { window, document, localStorage: {}, Promise, Date, JSON, Object, Error });
    return {
        client: window.runTrainingSheets,
        getFields: () => Object.fromEntries(submittedForm.children.map(input => [input.name, input.value])),
        respond: (origin, data) => messageHandler({ origin, data })
    };
}

test('aceita a resposta atual e ignora mensagens de outra origem', async () => {
    const client = createClient();
    const result = client.client.lookupCnpj('0');
    const { requestId, nonce } = client.getFields();
    assert.equal(nonce, requestId);
    client.respond('https://example.com', { nonce, ok: false });
    client.respond('https://script.google.com', {
        channel: 'run-training-sheets', requestId, response: { ok: true, data: { name: 'Empresa' } }
    });
    assert.equal((await result).name, 'Empresa');
});

test('informa imediatamente quando o Web App publicado usa outro protocolo', async () => {
    const client = createClient();
    const result = client.client.lookupCnpj('0');
    const { nonce } = client.getFields();
    client.respond('https://test.googleusercontent.com', { nonce, ok: false, error: 'Requisição inválida.' });
    await assert.rejects(result, /incompatível.*reimplante/);
});
