(function () {
    const config = window.RUN_TRAINING_SHEETS_CONFIG || {};
    const sessionStorageKey = 'run-training-admin-session';
    let requestCount = 0;

    function request(operation, payload) {
        if (!config.webAppUrl) {
            return Promise.reject(new Error('O Google Sheets ainda não foi configurado.'));
        }

        return new Promise((resolve, reject) => {
            const requestId = `run-training-${Date.now()}-${requestCount++}`;
            const frame = document.createElement('iframe');
            const form = document.createElement('form');
            const target = `run-training-request-${requestId}`;
            let timeoutId;

            frame.name = target;
            frame.hidden = true;
            form.hidden = true;
            form.method = 'POST';
            form.action = config.webAppUrl;
            form.target = target;

            const fields = {
                operation,
                requestId,
                payload: JSON.stringify(payload || {})
            };
            Object.entries(fields).forEach(([name, value]) => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = name;
                input.value = value;
                form.appendChild(input);
            });

            const cleanUp = () => {
                window.removeEventListener('message', onMessage);
                window.clearTimeout(timeoutId);
                form.remove();
                frame.remove();
            };
            const onMessage = event => {
                const isAppsScriptOrigin = event.origin === 'https://script.google.com'
                    || event.origin.endsWith('.googleusercontent.com');
                if (!isAppsScriptOrigin
                    || !event.data
                    || event.data.channel !== 'run-training-sheets'
                    || event.data.requestId !== requestId) return;
                cleanUp();
                if (!event.data.response || !event.data.response.ok) {
                    reject(new Error(event.data.response?.error || 'O serviço de planilhas retornou uma resposta inválida.'));
                    return;
                }
                resolve(event.data.response.data);
            };

            window.addEventListener('message', onMessage);
            timeoutId = window.setTimeout(() => {
                cleanUp();
                reject(new Error('O Google Sheets não respondeu. Confira a URL publicada e tente novamente.'));
            }, 20000);
            document.body.append(frame, form);
            form.submit();
        });
    }

    function getToken() {
        return localStorage.getItem(sessionStorageKey) || '';
    }

    window.runTrainingSheets = {
        isConfigured: () => Boolean(config.webAppUrl),
        login: async (email, password) => {
            const result = await request('login', { email, password });
            localStorage.setItem(sessionStorageKey, result.token);
            return result;
        },
        getSession: async () => {
            const token = getToken();
            if (!token) return null;
            try {
                return await request('session', { token });
            } catch (error) {
                localStorage.removeItem(sessionStorageKey);
                throw error;
            }
        },
        fetchSales: (filters, page, pageSize) => request('sales', {
            token: getToken(),
            filters,
            page,
            pageSize
        }),
        syncProductAvailability: products => request('syncAvailability', { products }),
        importCatalog: products => request('importCatalog', {
            token: getToken(),
            products
        }),
        fetchAvailability: () => request('availability', { token: getToken() }),
        updateProductAvailability: (productId, available, price) => request('updateProductAvailability', {
            token: getToken(),
            productId,
            available,
            price
        }),
        updateSaleTotal: (saleId, total) => request('updateSaleTotal', {
            token: getToken(),
            saleId,
            total
        }),
        deleteSale: saleId => request('deleteSale', {
            token: getToken(),
            saleId
        }),
        logout: async () => {
            const token = getToken();
            try {
                if (token) await request('logout', { token });
            } finally {
                localStorage.removeItem(sessionStorageKey);
            }
        }
    };

    window.recordAdminSale = async sale => {
        if (!config.webAppUrl) {
            return { saved: false, reason: 'A integração com Google Sheets ainda não está configurada.' };
        }
        await request('recordSale', sale);
        return { saved: true };
    };
}());
