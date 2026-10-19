(function () {
    const loginPanel = document.getElementById('admin-login');
    const loginForm = document.getElementById('admin-login-form');
    const loginButton = document.getElementById('admin-login-button');
    const loginMessage = document.getElementById('admin-login-message');
    const dashboard = document.getElementById('admin-dashboard');
    const dataMessage = document.getElementById('admin-data-message');
    const filterForm = document.getElementById('sales-filter-form');
    const tableBody = document.getElementById('sales-table-body');
    const emptyState = document.getElementById('sales-empty-state');
    const inventoryList = document.getElementById('inventory-list');
    const inventoryMessage = document.getElementById('inventory-message');
    const inventoryEmptyState = document.getElementById('inventory-empty-state');
    const inventorySearch = document.getElementById('inventory-search');
    const inventoryFilter = document.getElementById('inventory-filter');
    const catalogImportForm = document.getElementById('catalog-import-form');
    const catalogImportFile = document.getElementById('catalog-import-file');
    const catalogImportPreview = document.getElementById('catalog-import-preview');
    const catalogImportConfirmation = document.getElementById('catalog-import-delete-confirmation');
    const catalogImportConfirmButton = document.getElementById('catalog-import-confirm');
    const pageSize = 30;
    const sheets = window.runTrainingSheets;
    let currentPage = 0;
    let resultCount = 0;
    let inventoryProducts = [];
    let catalogImportPlan = null;
    let importedCatalogActive = false;

    function setMessage(element, message, isError) {
        element.textContent = message;
        element.classList.toggle('is-error', Boolean(isError));
        element.classList.toggle('is-success', Boolean(message) && !isError);
    }

    function formatMoney(value) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value) || 0);
    }

    function formatDate(value) {
        return new Intl.DateTimeFormat('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'short',
            timeZone: 'America/Sao_Paulo'
        }).format(new Date(value));
    }

    function appendCell(row, value, className) {
        const cell = document.createElement('td');
        cell.textContent = value;
        if (className) cell.className = className;
        row.appendChild(cell);
    }

    function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, character => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[character]));
    }

    function openOrderMirror(sale) {
        const itemRows = sale.items.length
            ? sale.items.map(item => {
                const variant = item.variant ? ` <small>${escapeHtml(item.variant)}</small>` : '';
                const quantity = Number(item.quantity);
                const unitPrice = Number(item.unitPrice);
                return `<tr>
                    <td>${escapeHtml(item.name)}${variant}</td>
                    <td class="number">${quantity}</td>
                    <td class="number">${formatMoney(unitPrice)}</td>
                    <td class="number">${formatMoney(quantity * unitPrice)}</td>
                </tr>`;
            }).join('')
            : '<tr><td colspan="4">Nenhum item detalhado foi salvo para este pedido.</td></tr>';

        const orderDate = escapeHtml(formatDate(sale.soldAt));
        const cnpj = escapeHtml(sale.cnpj);
        const paymentCondition = escapeHtml(sale.paymentCondition || 'Não informada');
        const orderId = escapeHtml(sale.id);
        const total = formatMoney(sale.total);
        const adminName = escapeHtml(document.getElementById('admin-display-name').textContent);
        const itemsTotal = sale.items.reduce((sum, item) => sum + Number(item.quantity) * Number(item.unitPrice), 0);
        const adjustmentNote = Math.abs(itemsTotal - Number(sale.total)) > 0.01
            ? '<p class="note">O valor total foi ajustado manualmente no painel; os valores dos itens representam o pedido original.</p>'
            : '';

        const mirrorHtml = `<!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
                <title>Espelho do pedido ${orderId}</title>
                <style>
                    * { box-sizing: border-box; }
                    html { width: 100%; }
                    body { width: 100%; min-height: 100vh; margin: 0; padding: 32px 16px; color: #17243a; background: #f1f5fb; font: 15px/1.5 Arial, sans-serif; }
                    main { width: min(800px, 100%); min-width: 0; margin: 0 auto; padding: 36px; background: #fff; border: 1px solid #dbe3ee; border-radius: 12px; }
                    header { display: flex; justify-content: space-between; gap: 20px; align-items: flex-start; padding-bottom: 20px; border-bottom: 2px solid #172554; }
                    h1 { margin: 0; color: #172554; font-size: 25px; }
                    header p { margin: 4px 0 0; color: #64748b; }
                    .badge { padding: 6px 10px; border-radius: 6px; background: #eff6ff; color: #1d4ed8; font-size: 12px; font-weight: bold; white-space: nowrap; }
                    .details { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 24px; margin: 24px 0; }
                    .details span { display: block; color: #64748b; font-size: 12px; }
                    .details strong { display: block; overflow-wrap: anywhere; }
                    table { width: 100%; table-layout: fixed; border-collapse: collapse; }
                    th, td { padding: 11px 9px; border-bottom: 1px solid #e2e8f0; text-align: left; }
                    th { color: #64748b; background: #f8fafc; font-size: 11px; text-transform: uppercase; }
                    th:first-child, td:first-child { width: 40%; overflow-wrap: anywhere; }
                    th:nth-child(2), td:nth-child(2) { width: 12%; }
                    th:nth-child(3), td:nth-child(3) { width: 22%; }
                    th:nth-child(4), td:nth-child(4) { width: 26%; }
                    td small { display: block; color: #64748b; }
                    .number { text-align: right; white-space: nowrap; }
                    tfoot td { border: 0; font-weight: bold; }
                    .total-label { text-align: right; }
                    .total-value { color: #172554; font-size: 20px; }
                    .note { margin: 24px 0 0; color: #64748b; font-size: 12px; }
                    .print-button { display: block; margin: 22px auto 0; padding: 11px 18px; border: 0; border-radius: 8px; background: #2f6fed; color: #fff; cursor: pointer; font-size: 14px; font-weight: bold; }
                    @media (max-width: 540px) { body { min-height: 100dvh; padding: 0; background: #fff; } main { width: 100%; min-height: 100dvh; padding: 22px 12px; border: 0; border-radius: 0; } header { flex-direction: column; } th, td { padding: 9px 4px; font-size: 11px; } th { font-size: 9px; } .number { font-size: 10px; } .details { gap: 12px; } }
                    @media print { body { min-height: 0; padding: 0; background: #fff; } main { width: 100%; min-height: 0; padding: 0; border: 0; } .print-button { display: none; } }
                </style>
            </head>
            <body>
                <main>
                    <header>
                        <div><h1>Run Training</h1><p>Espelho do pedido</p></div>
                        <span class="badge">Registro de envio</span>
                    </header>
                    <section class="details">
                        <div><span>Número do pedido</span><strong>${orderId}</strong></div>
                        <div><span>Data do envio</span><strong>${orderDate}</strong></div>
                        <div><span>CNPJ</span><strong>${cnpj}</strong></div>
                        <div><span>Condição de pagamento</span><strong>${paymentCondition}</strong></div>
                        <div><span>Administrador</span><strong>${adminName}</strong></div>
                    </section>
                    <table>
                        <thead><tr><th>Produto</th><th class="number">Qtd.</th><th class="number">Unitário</th><th class="number">Subtotal</th></tr></thead>
                        <tbody>${itemRows}</tbody>
                        <tfoot><tr><td class="total-label" colspan="3">Total do pedido</td><td class="number total-value">${total}</td></tr></tfoot>
                    </table>
                    ${adjustmentNote}
                    <p class="note">Este espelho registra um pedido enviado pelo catálogo. Não é comprovante de pagamento ou faturamento.</p>
                    <button class="print-button" type="button" onclick="window.print()">Imprimir / Salvar como PDF</button>
                </main>
            </body>
            </html>`;
        const mirrorUrl = URL.createObjectURL(new Blob([mirrorHtml], { type: 'text/html;charset=utf-8' }));
        const mirrorWindow = window.open(mirrorUrl, '_blank');
        if (!mirrorWindow) {
            URL.revokeObjectURL(mirrorUrl);
            setMessage(dataMessage, 'O navegador bloqueou a janela do espelho. Permita pop-ups para este site e tente novamente.', true);
            return;
        }
        mirrorWindow.opener = null;
        mirrorWindow.addEventListener('load', () => URL.revokeObjectURL(mirrorUrl), { once: true });
    }

    function parseMoneyInput(value) {
        const normalized = String(value).trim().replace(/[R$\s]/g, '');
        const amount = normalized.includes(',')
            ? Number(normalized.replace(/\./g, '').replace(',', '.'))
            : Number(normalized);
        if (!Number.isFinite(amount) || amount < 300 || amount > 1000000000) return null;
        return Math.round((amount + Number.EPSILON) * 100) / 100;
    }

    async function editSaleTotal(sale) {
        const value = window.prompt(
            `Informe o novo valor total do pedido ${sale.id} (mínimo R$ 300,00):`,
            Number(sale.total).toFixed(2).replace('.', ',')
        );
        if (value === null) return;

        const total = parseMoneyInput(value);
        if (total === null) {
            setMessage(dataMessage, 'Valor inválido. Informe um valor entre R$ 300,00 e R$ 1.000.000.000,00.', true);
            return;
        }
        if (total === Number(sale.total)) return;
        if (!window.confirm(`Atualizar o pedido ${sale.id} de ${formatMoney(sale.total)} para ${formatMoney(total)}? A comissão de 5% também será recalculada.`)) return;

        try {
            await sheets.updateSaleTotal(sale.id, total);
            await loadSales();
            setMessage(dataMessage, 'Valor do pedido atualizado e comissão recalculada.', false);
        } catch (error) {
            setMessage(dataMessage, `Não foi possível atualizar o pedido: ${error.message}`, true);
        }
    }

    async function removeSale(sale) {
        if (!window.confirm(`Excluir permanentemente o pedido ${sale.id}, CNPJ ${sale.cnpj}, no valor de ${formatMoney(sale.total)}? Esta ação não pode ser desfeita.`)) return;

        try {
            await sheets.deleteSale(sale.id);
            if (tableBody.rows.length === 1 && currentPage > 0) currentPage -= 1;
            await loadSales();
            setMessage(dataMessage, 'Pedido excluído.', false);
        } catch (error) {
            setMessage(dataMessage, `Não foi possível excluir o pedido: ${error.message}`, true);
        }
    }

    function showDashboard(profile) {
        loginPanel.hidden = true;
        dashboard.hidden = false;
        document.getElementById('admin-display-name').textContent = profile.displayName;
        loadInventory();
        loadSales();
    }

    async function loadInventory() {
        inventoryList.replaceChildren();
        inventoryEmptyState.hidden = true;
        setMessage(inventoryMessage, 'Carregando produtos...', false);
        try {
            const catalogProducts = window.RUN_TRAINING_CATALOG.products
                .filter(product => !window.RUN_TRAINING_CATALOG.hiddenCatalogProductIds.has(product.id))
                .map(product => ({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    forceUnavailable: product.price == null
                }));
            const result = await sheets.syncProductAvailability(catalogProducts);
            importedCatalogActive = result.imported === true;
            if (importedCatalogActive) {
                const productsById = new Map(catalogProducts.map(product => [product.id, product]));
                inventoryProducts = result.catalog.map(product => {
                    const original = productsById.get(Number(product.id));
                    const price = Number(product.price);
                    const hasPrice = Number.isFinite(price) && price > 0;
                    return {
                        id: Number(product.id),
                        name: product.name,
                        image: original ? original.image : 'assets/images/branding/logo.png.jpg',
                        price: hasPrice ? price : null,
                        catalogPrice: hasPrice ? price : null,
                        hasPrice,
                        available: product.available === true
                    };
                });
            } else {
                inventoryProducts = catalogProducts.map(product => {
                    const override = Number(result.prices[String(product.id)]);
                    const price = Number.isFinite(override) && override > 0 ? override : product.price;
                    const hasPrice = Number.isFinite(Number(price)) && Number(price) > 0;
                    return {
                        ...product,
                        price: hasPrice ? Number(price) : null,
                        catalogPrice: hasPrice ? Number(price) : null,
                        hasPrice,
                        available: result.availability[String(product.id)] !== false
                    };
                });
            }
            renderInventory();
            setMessage(inventoryMessage, '', false);
        } catch (error) {
            setMessage(inventoryMessage, `Não foi possível carregar os produtos: ${error.message}`, true);
        }
    }

    function renderInventory() {
        const search = inventorySearch.value.trim().toLocaleLowerCase('pt-BR');
        const filter = inventoryFilter.value;
        const filteredProducts = inventoryProducts.filter(product => {
            const matchesSearch = product.name.toLocaleLowerCase('pt-BR').includes(search);
            const matchesFilter = filter === 'all'
                || (filter === 'available' && product.available)
                || (filter === 'unavailable' && !product.available);
            return matchesSearch && matchesFilter;
        });
        const availableCount = inventoryProducts.filter(product => product.available).length;
        const unavailableCount = inventoryProducts.length - availableCount;
        const summary = document.getElementById('inventory-summary');
        summary.replaceChildren();
        [
            { label: `${availableCount} disponíveis`, className: 'inventory-count' },
            { label: `${unavailableCount} indisponíveis`, className: 'inventory-count inventory-count--unavailable' }
        ].forEach(item => {
            const badge = document.createElement('span');
            badge.className = item.className;
            badge.textContent = item.label;
            summary.appendChild(badge);
        });

        inventoryList.replaceChildren();
        filteredProducts.forEach(product => {
            const row = document.createElement('article');
            row.className = 'inventory-product';
            row.setAttribute('role', 'listitem');

            const info = document.createElement('div');
            info.className = 'inventory-product-info';
            const name = document.createElement('strong');
            name.className = 'inventory-product-name';
            name.textContent = product.name;
            const id = document.createElement('span');
            id.className = 'inventory-product-id';
            id.textContent = `Código ${product.id}`;
            info.append(name, id);

            const actions = document.createElement('div');
            actions.className = 'inventory-product-actions';
            if (product.catalogPrice == null) {
                const priceField = document.createElement('label');
                priceField.className = 'inventory-price-field';
                priceField.textContent = 'Preço';
                const priceInput = document.createElement('input');
                priceInput.type = 'number';
                priceInput.min = '0.01';
                priceInput.step = '0.01';
                priceInput.inputMode = 'decimal';
                priceInput.placeholder = '0,00';
                priceInput.value = product.hasPrice ? product.price.toFixed(2) : '';
                priceInput.setAttribute('aria-label', `Preço de ${product.name}`);
                priceField.appendChild(priceInput);
                actions.appendChild(priceField);

                const savePriceButton = document.createElement('button');
                savePriceButton.type = 'button';
                savePriceButton.className = 'admin-primary-button inventory-toggle';
                savePriceButton.textContent = product.hasPrice ? 'Salvar preço' : 'Salvar preço e ativar';
                savePriceButton.addEventListener('click', () => saveProductPrice(product, priceInput, savePriceButton));
                actions.appendChild(savePriceButton);
            }

            const status = document.createElement('span');
            status.className = `inventory-status${product.available ? '' : ' inventory-status--unavailable'}`;
            status.textContent = product.available ? 'Disponível' : 'Indisponível';
            const toggle = document.createElement('button');
            toggle.type = 'button';
            toggle.className = `admin-secondary-button inventory-toggle${product.available ? ' inventory-toggle--unavailable' : ''}`;
            toggle.textContent = product.available ? 'Marcar indisponível' : 'Marcar disponível';
            toggle.disabled = !product.hasPrice;
            if (product.hasPrice) toggle.addEventListener('click', () => updateInventoryProduct(product, toggle));
            actions.append(status, toggle);
            row.append(info, actions);
            inventoryList.appendChild(row);
        });
        inventoryEmptyState.hidden = filteredProducts.length > 0;
    }

    async function updateInventoryProduct(product, button) {
        const nextAvailability = !product.available;
        button.disabled = true;
        setMessage(inventoryMessage, 'Salvando disponibilidade...', false);
        try {
            await sheets.updateProductAvailability(product.id, nextAvailability);
            product.available = nextAvailability;
            renderInventory();
            setMessage(inventoryMessage, `${product.name}: ${nextAvailability ? 'disponível' : 'indisponível'}.`, false);
        } catch (error) {
            button.disabled = false;
            setMessage(inventoryMessage, `Não foi possível atualizar ${product.name}: ${error.message}`, true);
        }
    }

    async function saveProductPrice(product, input, button) {
        const price = Number(input.value.replace(',', '.'));
        if (!Number.isFinite(price) || price <= 0) {
            setMessage(inventoryMessage, `Informe um preço válido para ${product.name}.`, true);
            input.focus();
            return;
        }

        const shouldActivate = !product.hasPrice;
        button.disabled = true;
        setMessage(inventoryMessage, 'Salvando preço...', false);
        try {
            const result = await sheets.updateProductAvailability(
                product.id,
                shouldActivate ? true : product.available,
                price
            );
            product.price = result.price;
            product.catalogPrice = result.price;
            product.hasPrice = true;
            product.available = result.available;
            renderInventory();
            setMessage(
                inventoryMessage,
                `${product.name}: preço ${formatMoney(result.price)} salvo${shouldActivate ? ' e produto ativado' : ''}.`,
                false
            );
        } catch (error) {
            button.disabled = false;
            setMessage(inventoryMessage, `Não foi possível salvar o preço de ${product.name}: ${error.message}`, true);
        }
    }

    function normalizeCatalogName(name) {
        return String(name)
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLocaleLowerCase('pt-BR')
            .replace(/[^a-z0-9]/g, '');
    }

    function buildCatalogImportPlan(pdfProducts) {
        const byName = new Map();
        inventoryProducts.forEach(product => {
            const key = normalizeCatalogName(product.name);
            if (byName.has(key)) {
                throw new Error(`Há mais de um produto atual com o nome "${product.name}". Resolva a duplicidade antes de importar.`);
            }
            byName.set(key, product);
        });

        const uniqueProducts = new Map();
        let duplicateCount = 0;
        pdfProducts.forEach(product => {
            const key = normalizeCatalogName(product.name);
            const previous = uniqueProducts.get(key);
            if (previous) {
                if (previous.price !== product.price) {
                    throw new Error(`O produto "${product.name}" aparece mais de uma vez no PDF com preços diferentes.`);
                }
                duplicateCount += 1;
                return;
            }
            uniqueProducts.set(key, product);
        });

        const usedIds = new Set();
        let nextId = Math.max(
            0,
            ...window.RUN_TRAINING_CATALOG.products.map(product => Number(product.id) || 0),
            ...inventoryProducts.map(product => Number(product.id) || 0)
        ) + 1;
        const products = [...uniqueProducts.entries()].map(([key, product]) => {
            const existing = byName.get(key);
            if (existing) usedIds.add(existing.id);
            const hasExistingPrice = existing && existing.hasPrice;
            return {
                id: existing ? existing.id : nextId++,
                name: product.name,
                price: product.price,
                available: existing ? (hasExistingPrice ? existing.available : true) : true,
                image: existing && existing.image ? existing.image : 'assets/images/branding/logo.png.jpg',
                catalogPrice: product.price,
                hasPrice: true,
                previousName: existing ? existing.name : '',
                previousPrice: existing && existing.hasPrice ? existing.price : null,
                isNew: !existing
            };
        });
        const removed = inventoryProducts.filter(product => !usedIds.has(product.id));
        const changed = products.filter(product => !product.isNew
            && (product.name !== product.previousName || product.price !== product.previousPrice));
        return { products, removed, changed, duplicateCount };
    }

    function appendImportList(container, title, items, getText, className) {
        if (!items.length) return;
        const details = document.createElement('details');
        const summary = document.createElement('summary');
        summary.textContent = `${title} (${items.length})`;
        const list = document.createElement('ul');
        items.forEach(item => {
            const row = document.createElement('li');
            row.textContent = getText(item);
            list.appendChild(row);
        });
        if (className) details.className = className;
        details.append(summary, list);
        container.appendChild(details);
    }

    function renderCatalogImportPreview(fileName, plan) {
        document.getElementById('catalog-import-filename').textContent = fileName;
        const summary = document.getElementById('catalog-import-summary');
        summary.replaceChildren();
        [
            { label: `${plan.products.length} produtos na nova lista`, className: 'catalog-import-count' },
            { label: `${plan.changed.length} produtos com nome ou preço alterado`, className: 'catalog-import-count' },
            { label: `${plan.products.filter(product => product.isNew).length} novos produtos`, className: 'catalog-import-count catalog-import-count--added' },
            { label: `${plan.removed.length} produtos serão removidos`, className: 'catalog-import-count catalog-import-count--removed' }
        ].forEach(item => {
            const badge = document.createElement('span');
            badge.className = item.className;
            badge.textContent = item.label;
            summary.appendChild(badge);
        });
        if (plan.duplicateCount) {
            const note = document.createElement('p');
            note.className = 'admin-message';
            note.textContent = `${plan.duplicateCount} repetição(ões) idêntica(s) no PDF será(ão) ignorada(s).`;
            summary.appendChild(note);
        }

        const lists = document.getElementById('catalog-import-lists');
        lists.replaceChildren();
        appendImportList(
            lists,
            'Alterados',
            plan.changed,
            product => `${product.previousName} → ${product.name} · ${formatMoney(product.previousPrice || 0)} → ${formatMoney(product.price)}`
        );
        appendImportList(
            lists,
            'Novos',
            plan.products.filter(product => product.isNew),
            product => `${product.name} · ${formatMoney(product.price)}`
        );
        appendImportList(lists, 'Removidos', plan.removed, product => product.name, 'catalog-import-list--removed');
        catalogImportPreview.hidden = false;
        catalogImportConfirmation.checked = false;
        catalogImportConfirmButton.disabled = true;
    }

    catalogImportFile.addEventListener('change', () => {
        catalogImportPlan = null;
        catalogImportPreview.hidden = true;
        catalogImportConfirmation.checked = false;
        setMessage(document.getElementById('catalog-import-message'), '', false);
    });

    catalogImportForm.addEventListener('submit', async event => {
        event.preventDefault();
        const file = catalogImportFile.files[0];
        if (!file) {
            setMessage(document.getElementById('catalog-import-message'), 'Selecione um arquivo PDF.', true);
            return;
        }
        const analyzeButton = document.getElementById('catalog-import-analyze');
        analyzeButton.disabled = true;
        catalogImportPlan = null;
        catalogImportPreview.hidden = true;
        catalogImportConfirmation.checked = false;
        catalogImportConfirmButton.disabled = true;
        setMessage(document.getElementById('catalog-import-message'), 'Lendo e validando o PDF...', false);
        try {
            const { extractCatalogPdf } = await import('./catalog-import.js');
            const products = await extractCatalogPdf(file);
            catalogImportPlan = buildCatalogImportPlan(products);
            renderCatalogImportPreview(file.name, catalogImportPlan);
            setMessage(document.getElementById('catalog-import-message'), 'Confira os produtos alterados, novos e removidos antes de confirmar.', false);
        } catch (error) {
            setMessage(document.getElementById('catalog-import-message'), `Não foi possível analisar o PDF: ${error.message}`, true);
        } finally {
            analyzeButton.disabled = false;
        }
    });

    catalogImportConfirmation.addEventListener('change', () => {
        catalogImportConfirmButton.disabled = !catalogImportConfirmation.checked || !catalogImportPlan;
    });

    catalogImportConfirmButton.addEventListener('click', async () => {
        if (!catalogImportPlan || !catalogImportConfirmation.checked) return;
        const plan = catalogImportPlan;
        catalogImportConfirmButton.disabled = true;
        setMessage(document.getElementById('catalog-import-message'), 'Salvando o novo catálogo...', false);
        try {
            const result = await sheets.importCatalog(plan.products.map(product => ({
                id: product.id,
                name: product.name,
                price: product.price,
                available: product.available
            })));
            catalogImportPlan = null;
            catalogImportPreview.hidden = true;
            catalogImportForm.reset();
            await loadInventory();
            setMessage(
                document.getElementById('catalog-import-message'),
                `Catálogo atualizado: ${Number(result.importedCount).toLocaleString('pt-BR')} produtos importados.`,
                false
            );
        } catch (error) {
            setMessage(document.getElementById('catalog-import-message'), `Não foi possível importar o catálogo: ${error.message}`, true);
            catalogImportConfirmButton.disabled = false;
        }
    });

    async function loadSales() {
        setMessage(dataMessage, 'Carregando vendas...', false);
        tableBody.replaceChildren();
        emptyState.hidden = true;

        const filters = {
            startDate: document.getElementById('filter-start-date').value || '',
            endDate: document.getElementById('filter-end-date').value || '',
            search: document.getElementById('filter-search').value.trim()
        };

        try {
            const result = await sheets.fetchSales(filters, currentPage, pageSize);
            document.getElementById('summary-count').textContent = Number(result.saleCount).toLocaleString('pt-BR');
            document.getElementById('summary-total').textContent = formatMoney(result.grossTotal);
            document.getElementById('summary-commission').textContent = formatMoney(result.commissionTotal);
            resultCount = result.saleCount;
            result.sales.forEach(sale => {
                const row = document.createElement('tr');
                appendCell(row, formatDate(sale.soldAt));
                appendCell(row, sale.cnpj);
                appendCell(row, formatMoney(sale.total), 'admin-money');
                appendCell(row, formatMoney(sale.commission), 'admin-money admin-commission-value');
                const actionCell = document.createElement('td');
                const mirrorButton = document.createElement('button');
                mirrorButton.type = 'button';
                mirrorButton.className = 'admin-secondary-button admin-mirror-button';
                mirrorButton.textContent = 'Espelho';
                mirrorButton.addEventListener('click', () => openOrderMirror(sale));
                actionCell.appendChild(mirrorButton);

                const editButton = document.createElement('button');
                editButton.type = 'button';
                editButton.className = 'admin-secondary-button admin-action-button';
                editButton.textContent = 'Editar valor';
                editButton.addEventListener('click', () => editSaleTotal(sale));
                actionCell.appendChild(editButton);

                const deleteButton = document.createElement('button');
                deleteButton.type = 'button';
                deleteButton.className = 'admin-danger-button admin-action-button';
                deleteButton.textContent = 'Excluir';
                deleteButton.addEventListener('click', () => removeSale(sale));
                actionCell.appendChild(deleteButton);
                row.appendChild(actionCell);
                tableBody.appendChild(row);
            });
            emptyState.hidden = result.sales.length !== 0;
            setMessage(dataMessage, '', false);
            updatePagination();
        } catch (error) {
            setMessage(dataMessage, `Erro ao carregar o histórico: ${error.message}`, true);
            document.getElementById('next-page-button').disabled = true;
        }
    }

    function updatePagination() {
        const totalPages = Math.max(1, Math.ceil(resultCount / pageSize));
        document.getElementById('page-indicator').textContent = `Página ${currentPage + 1} de ${totalPages}`;
        document.getElementById('previous-page-button').disabled = currentPage === 0;
        document.getElementById('next-page-button').disabled = currentPage + 1 >= totalPages;
    }

    loginForm.addEventListener('submit', async event => {
        event.preventDefault();
        setMessage(loginMessage, '', false);
        loginButton.disabled = true;
        loginButton.textContent = 'Entrando...';
        const formData = new FormData(loginForm);
        try {
            const profile = await sheets.login(formData.get('email'), formData.get('password'));
            loginForm.reset();
            showDashboard(profile);
        } catch (error) {
            setMessage(loginMessage, `Não foi possível entrar: ${error.message}`, true);
        } finally {
            loginButton.disabled = false;
            loginButton.textContent = 'Entrar';
        }
    });

    filterForm.addEventListener('submit', event => {
        event.preventDefault();
        currentPage = 0;
        loadSales();
    });

    inventorySearch.addEventListener('input', renderInventory);
    inventoryFilter.addEventListener('change', renderInventory);

    document.getElementById('clear-filters-button').addEventListener('click', () => {
        filterForm.reset();
        currentPage = 0;
        loadSales();
    });
    document.getElementById('previous-page-button').addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage -= 1;
            loadSales();
        }
    });
    document.getElementById('next-page-button').addEventListener('click', () => {
        if ((currentPage + 1) * pageSize < resultCount) {
            currentPage += 1;
            loadSales();
        }
    });
    document.getElementById('admin-logout-button').addEventListener('click', async () => {
        try {
            await sheets.logout();
            dashboard.hidden = true;
            loginPanel.hidden = false;
            setMessage(loginMessage, 'Você saiu do painel.', false);
        } catch (error) {
            setMessage(dataMessage, `Não foi possível sair: ${error.message}`, true);
        }
    });

    async function restoreSession() {
        try {
            const profile = await sheets.getSession();
            if (profile) showDashboard(profile);
        } catch (error) {
            setMessage(loginMessage, `Não foi possível restaurar a sessão: ${error.message}`, true);
        }
    }

    if (!sheets || !sheets.isConfigured()) {
        setMessage(loginMessage, 'Configure a URL do Web App do Google Sheets para habilitar o painel. Consulte o README para os passos.', true);
        loginForm.hidden = true;
        return;
    }
    restoreSession();
}());
