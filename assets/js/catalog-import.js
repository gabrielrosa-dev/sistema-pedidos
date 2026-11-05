import * as pdfjsLib from './vendor/pdfjs/pdf.min.mjs';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    './vendor/pdfjs/pdf.worker.min.mjs',
    import.meta.url
).toString();

function normalizeLineItems(items) {
    const lines = [];
    items
        .filter(item => item.str && item.str.trim())
        .forEach(item => {
            const y = Number(item.transform[5]);
            let line = lines.find(candidate => Math.abs(candidate.y - y) <= 1.5);
            if (!line) {
                line = { y, items: [] };
                lines.push(line);
            }
            line.items.push({ x: Number(item.transform[4]), text: item.str.replace(/\u00a0/g, ' ').trim() });
        });

    return lines.map(line => ({
        y: line.y,
        items: line.items.sort((first, second) => first.x - second.x),
        text: line.items.sort((first, second) => first.x - second.x)
            .map(item => item.text)
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim()
    }));
}

function parsePrice(text) {
    const match = text.match(/^R\$\s*(\d{1,3}(?:\.\d{3})*,\d{2}|\d+,\d{2})$/i);
    if (!match) return null;
    const value = Number(match[1].replace(/\./g, '').replace(',', '.'));
    return Number.isFinite(value) && value > 0 ? value : null;
}

function mergeSplitPrices(line) {
    const merged = [];
    for (let index = 0; index < line.items.length; index += 1) {
        const item = line.items[index];
        const next = line.items[index + 1];
        if (/^R\$$/i.test(item.text) && next && /^\d[\d.]*,\d{2}$/.test(next.text)) {
            merged.push({ x: item.x, text: `R$ ${next.text}` });
            index += 1;
        } else {
            const inline = item.text.match(/^(.+?)\s+(R\$\s*\d{1,3}(?:\.\d{3})*,\d{2}|R\$\s*\d+,\d{2})$/i);
            if (inline && !parsePrice(item.text)) {
                merged.push({ x: item.x, text: inline[1].trim() });
                merged.push({ x: item.x + 1000, text: inline[2] });
            } else {
                merged.push(item);
            }
        }
    }
    line.items = merged;
}

function getProductName(priceLine, lines, priceItem) {
    const sameLine = priceLine.items
        .filter(item => item.x < priceItem.x && !/^R\$/i.test(item.text))
        .map(item => item.text);
    if (sameLine.length) return sameLine.join(' ').replace(/\s+/g, ' ').trim();

    const nearby = lines
        .filter(line => Math.abs(line.y - priceLine.y) <= 34)
        .map(line => ({
            line,
            distance: Math.abs(line.y - priceLine.y),
            textItems: line.items.filter(item => item.x < priceItem.x)
        }))
        .filter(candidate => candidate.textItems.length
            && !/^PRODUTOS?\b/i.test(candidate.line.text)
            && !/^R\$/i.test(candidate.line.text));

    const productHeading = nearby
        .filter(candidate => /^KIT\b/i.test(candidate.line.text))
        .sort((first, second) => first.distance - second.distance)[0];
    const selected = productHeading || nearby
        .sort((first, second) => first.distance - second.distance)[0];
    if (!selected) return '';
    return selected.textItems.map(item => item.text).join(' ').replace(/\s+/g, ' ').trim();
}

export async function extractCatalogPdf(file) {
    if (!file || !/\.pdf$/i.test(file.name) || file.size > 15 * 1024 * 1024) {
        throw new Error('Selecione um arquivo PDF de até 15 MB.');
    }

    const pdf = await pdfjsLib.getDocument({
        data: new Uint8Array(await file.arrayBuffer()),
        verbosity: 0
    }).promise;
    if (pdf.numPages > 30) throw new Error('O PDF excede o limite de 30 páginas.');

    const products = [];
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        const page = await pdf.getPage(pageNumber);
        const content = await page.getTextContent();
        const lines = normalizeLineItems(content.items);
        lines.forEach(line => {
            line.items.forEach(item => {
                const price = parsePrice(item.text);
                if (price === null) return;
                products.push({
                    name: getProductName(line, lines, item),
                    price,
                    page: pageNumber
                });
            });
        });
    }

    const named = products.filter(product => product.name && !/^(PRE[ÇC]O|PRODUTOS?)$/i.test(product.name));
    if (named.length < 20 || products.length - named.length > Math.max(3, products.length * 0.03)) {
        throw new Error('Não foi possível identificar com segurança todos os produtos e preços do PDF. Nenhuma alteração foi feita.');
    }
    return named;
}
