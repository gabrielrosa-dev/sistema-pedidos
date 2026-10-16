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
    const pageSize = 30;
    const sheets = window.runTrainingSheets;
    let currentPage = 0;
    let resultCount = 0;

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
        loadSales();
    }

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
