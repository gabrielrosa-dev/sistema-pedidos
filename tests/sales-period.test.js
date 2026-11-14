const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');

function createServer(rows) {
    const context = {
        Utilities: {
            formatDate(date, timezone) {
                const parts = new Intl.DateTimeFormat('en-CA', {
                    timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit'
                }).formatToParts(date);
                const get = type => parts.find(part => part.type === type).value;
                return `${get('year')}-${get('month')}-${get('day')}`;
            }
        }
    };
    vm.createContext(context);
    vm.runInContext(fs.readFileSync(path.join(root, 'google-apps-script', 'Code.gs'), 'utf8'), context);
    context.getSessionAdminKey = token => token;
    context.getSalesSheet = () => ({
        getLastRow: () => rows.length + 1,
        getRange: () => ({ getValues: () => rows.map(row => [...row]) })
    });
    context.fillMissingCompanyNames = () => {};
    return context;
}

function sale(id, admin, date, total) {
    return [id, admin, '12345678000190', new Date(date), total, total * 0.05, 'Pix', '[]', 'Empresa'];
}

test('periods include both boundary days and keep administrators and totals separate', () => {
    const server = createServer([
        sale('before', 'gabriel', '2026-11-11T02:59:59Z', 100),
        sale('start', 'gabriel', '2026-11-11T03:00:00Z', 200),
        sale('end', 'gabriel', '2026-12-11T02:59:59Z', 300),
        sale('after', 'gabriel', '2026-12-11T03:00:00Z', 400),
        sale('other', 'vanderson', '2026-11-12T12:00:00Z', 900)
    ]);
    const result = server.listSales({
        token: 'gabriel',
        filters: { periodStart: '2026-11-11', periodEnd: '2026-12-10' }
    });
    assert.deepEqual(Array.from(result.sales, row => row.id), ['end', 'start']);
    assert.equal(result.saleCount, 2);
    assert.equal(result.grossTotal, 500);
    assert.equal(result.overall.saleCount, 4);
    assert.equal(result.overall.grossTotal, 1000);
    assert.equal(result.overall.commissionTotal, 50);
    assert.deepEqual(Array.from(result.periods, row => [row.key, row.grossTotal]), [
        ['2027-01', 400], ['2026-12', 500], ['2026-11', 100]
    ]);

    const filtered = server.listSales({
        token: 'gabriel',
        filters: { periodStart: '2026-11-11', periodEnd: '2026-12-10', startDate: '2026-12-01' }
    });
    assert.deepEqual(Array.from(filtered.sales, row => row.id), ['end']);
    assert.equal(filtered.overall.grossTotal, 1000);
    assert.equal(filtered.periods.find(row => row.key === '2026-12').grossTotal, 500);
});

test('empty history returns empty period summaries', () => {
    const result = createServer([]).listSales({ token: 'gabriel' });
    assert.equal(result.overall.saleCount, 0);
    assert.equal(result.overall.grossTotal, 0);
    assert.equal(result.periods.length, 0);
    assert.equal(result.sales.length, 0);
});

test('period labels and ranges handle January and leap years', () => {
    const source = fs.readFileSync(path.join(root, 'assets', 'js', 'admin.js'), 'utf8');
    const start = source.indexOf('    function currentSalesPeriod()');
    const end = source.indexOf('    function appendCell(', start);
    assert.ok(start >= 0 && end > start);
    const context = {};
    vm.createContext(context);
    vm.runInContext(source.slice(start, end), context);
    const january = context.salesPeriodDetails('2027-01');
    assert.equal(january.startDate, '2026-12-11');
    assert.equal(january.endDate, '2027-01-10');
    assert.match(january.label, /2027/);
    const march = context.salesPeriodDetails('2024-03');
    assert.equal(march.startDate, '2024-02-11');
    assert.equal(march.endDate, '2024-03-10');
});
