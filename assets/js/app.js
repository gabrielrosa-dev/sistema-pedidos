// Base de dados completa extraída do catálogo[cite: 2]
const { products, promotions, excludedSoapIds, hiddenCatalogProductIds } = window.RUN_TRAINING_CATALOG;

const condicoesPagamento = [
    { nome: "Pix", boletos: 1 },
    { nome: "7", boletos: 1 },
    { nome: "14", boletos: 1 },
    { nome: "21", boletos: 1 },
    { nome: "28", boletos: 1 },
    { nome: "35", boletos: 1 },
    { nome: "7/14", boletos: 2 },
    { nome: "14/21", boletos: 2 },
    { nome: "21/28", boletos: 2 },
    { nome: "28/35", boletos: 2 },
    { nome: "7/14/21", boletos: 3 },
    { nome: "14/21/28", boletos: 3 },
    { nome: "21/28/35", boletos: 3 },
    { nome: "7/14/21/28", boletos: 4 },
    { nome: "14/21/28/35", boletos: 4 }
];

const whatsappDestinatarios = {
    padrao: '5541995922369',
    vanderson: '5541988604367'
};

const productVariants = {
    65: { label: 'Cor', options: ['Preto', 'Azul', 'Verde', 'Amarelo', 'Rosa'] },
    66: { label: 'Cor', options: ['Preta', 'Lilás', 'Azul', 'Rosa', 'Bege'] },
    82: { label: 'Tamanho', options: ['14', '16', '18', '20', '22', '24'] },
    113: { label: 'Tamanho', options: ['M', 'G'] },
    119: { label: 'Cor', options: ['Preto', 'Rosa', 'Verde', 'Vermelho'] },
    169: { label: 'Sabor', options: [], allowCustom: true, customLabel: 'Digite o sabor' },
    153: { label: 'Tamanho', options: ['PP', 'P', 'M', 'G'] },
    154: { label: 'Tamanho', options: ['PP', 'P', 'M', 'G'] },
    158: { label: 'Tamanho', options: ['P', 'M', 'G'] },
    161: { label: 'Tamanho', options: ['PP', 'P', 'M', 'G'] },
    162: { label: 'Tamanho', options: ['PP', 'P', 'M', 'G'] },
    163: { label: 'Tamanho', options: ['PP', 'P', 'M', 'G'] },
    194: { label: 'Tamanho', options: ['P', 'M', 'G', 'GG'] },
    282: { label: 'Linha', options: ['B-Tox', 'Liso c/ Força', 'Ameixa Negra', 'Cacheamos', 'Loiro Perfeito', 'Ômega 3', 'Nutrecôco', 'Cavalo de Raça', 'Chuva de Verniz', 'Descansa Cabelo', 'Mandioca', 'Óleo de Argan', 'Hialurônico'] },
    283: { label: 'Aroma', options: ['Tutti Frutti', 'Uva', 'Melancia', 'Banana'] },
    295: { label: 'Aroma', options: ['Belle Rose', 'Ameixa', 'Vanilla', 'Morango c/ Champagne'] },
    296: { label: 'Aroma', options: ['Delicada', 'Algodão Doce', 'Morango & Chantilly', 'Cereja', 'Flores Delicadas', 'Rosa Mosqueta', 'Kit/Variados'] },
    297: { label: 'Aroma', options: ['Maracujá / Erva Doce', 'Frutas Vermelhas'] },
    300: { label: 'Aroma', options: ['Uva', 'Tutti-Frutti'] },
    316: { label: 'Aroma', options: ['Cereja', 'Amora', 'Barbatimão e Flor de Algodão', 'Pétalas de Rosas', 'Roma e Aroeira', 'Rosa Mosqueta', 'Vanilla', 'Pêssego'] },
    354: { label: 'Tipo', options: ['Shampoo', 'Condicionador', 'Sabonete líquido', 'Colônia'] },
    1000: { label: 'Aroma', options: ['Uva', 'Tutti-frutti', 'Melancia', 'Banana'] },
    1003: {label: 'Tipo', options: ['Canela de Velho', 'Tira com a Mão', 'Fisiofort Verde', 'Fisiofort Slim', 'Milagrosa', 'Sebo de Carneiro', 'Sebo de Carneiro', 'Creme Dermessence 10% Ureia'] },
    341: { label: 'Aroma', options: ['Ameixa Negra', 'Vinagre de Maçã', 'Ômega'], allowCustom: true, customLabel: 'Digite outro aroma' },
    335: { label: 'Opção', options: [], allowCustom: true, customLabel: 'Digite a opção' }
};

function getWhatsAppDestinatario() {
    const destino = new URLSearchParams(window.location.search).get('destino');
    return whatsappDestinatarios[destino] || whatsappDestinatarios.padrao;
}

const appInstallBannerEl = document.getElementById('app-install-banner');
const installAppButtonEl = document.getElementById('install-app-button');
const dismissInstallButtonEl = document.getElementById('dismiss-install-button');
let deferredInstallPrompt = null;
const installDismissedKey = 'run-training-install-dismissed';
const appInstalledKey = 'run-training-app-installed';
const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

function showInstallNotification() {
    if (!appInstallBannerEl
        || isStandalone
        || localStorage.getItem(appInstalledKey)
        || sessionStorage.getItem(installDismissedKey)) return;
    appInstallBannerEl.hidden = false;

    const copyEl = appInstallBannerEl.querySelector('.app-install-copy span');
    if (isIOS) {
        if (copyEl) copyEl.textContent = 'No iPhone/iPad: toque em compartilhar e escolha “Adicionar à Tela de Início”.';
        if (installAppButtonEl) installAppButtonEl.hidden = true;
        return;
    }

    if (copyEl && !deferredInstallPrompt) {
        copyEl.textContent = 'Instale o catálogo pelo menu do navegador para acessá-lo como aplicativo.';
    }
    if (installAppButtonEl) {
        installAppButtonEl.hidden = false;
        installAppButtonEl.textContent = 'Instalar';
    }
}

function hideInstallNotification(savePreference = false) {
    if (appInstallBannerEl) appInstallBannerEl.hidden = true;
    if (savePreference) sessionStorage.setItem(installDismissedKey, 'true');
}

window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    showInstallNotification();
});

window.addEventListener('appinstalled', () => {
    localStorage.setItem(appInstalledKey, 'true');
    hideInstallNotification();
});

if ('serviceWorker' in navigator && /^https?:$/.test(window.location.protocol)) {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {});
}

installAppButtonEl?.addEventListener('click', async () => {
    if (!deferredInstallPrompt) {
        const copyEl = appInstallBannerEl?.querySelector('.app-install-copy span');
        if (copyEl) copyEl.textContent = 'Abra o menu do navegador e escolha “Instalar” ou “Adicionar à tela inicial”.';
        installAppButtonEl.textContent = 'Ver instruções';
        return;
    }

    const installPrompt = deferredInstallPrompt;
    deferredInstallPrompt = null;
    await installPrompt.prompt();
});

dismissInstallButtonEl?.addEventListener('click', () => hideInstallNotification(true));

if (!isStandalone && !localStorage.getItem(appInstalledKey) && appInstallBannerEl) {
    showInstallNotification();
}

const productListEl = document.getElementById('product-list');
const totalValEl = document.getElementById('total-val');
const minWarningEl = document.getElementById('min-warning');
const cnpjEl = document.getElementById('cnpj');
const condicaoPagamentoEl = document.getElementById('condicao-pagamento');
const checkoutBoxEl = document.querySelector('.checkout-box');
const productSearchEl = document.getElementById('product-search');
const productCountEl = document.getElementById('product-count');
const productSortEl = document.getElementById('product-sort');
const stockSyncMessageEl = document.getElementById('stock-sync-message');
const categoryFilterEls = document.querySelectorAll('.category-filter');
const catalogTitleEl = document.getElementById('catalog-title');
const openPromotionsButtonEl = document.getElementById('open-promotions-button');
const backToCatalogButtonEl = document.getElementById('back-to-catalog-button');
let activeCategory = 'todos';
let activeSort = 'name-asc';
let promotionsOnly = false;
const orderPanelEl = document.getElementById('order-panel');
const orderItemsEl = document.getElementById('order-items');
const orderItemCountEl = document.getElementById('order-item-count');
const orderTotalEl = document.getElementById('order-total');
const selectedCountEl = document.getElementById('selected-count');
const viewOrderButtonEl = document.getElementById('view-order-button');
const floatingOrderBarEl = document.getElementById('floating-order-bar');
const floatingTotalEl = document.getElementById('floating-total');
const selectedUnitsEl = document.getElementById('selected-units');
const productDetailPanelEl = document.getElementById('product-detail-panel');
const productDetailTitleEl = document.getElementById('product-detail-title');
const productDetailDescriptionEl = document.getElementById('product-detail-description');
const productDetailImageEl = document.getElementById('product-detail-image');
const productDetailPriceEl = document.getElementById('product-detail-price');
const productDetailVariantsEl = document.getElementById('product-detail-variants');
const productDetailQuantityEl = document.getElementById('product-detail-quantity');
const addProductButtonEl = document.getElementById('add-product-button');
let activeProductId = null;

function getProductVariantConfig(productId) {
    return productVariants[productId] || null;
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

function encodeVariantOption(option) {
    return encodeURIComponent(option).replace(/'/g, '%27');
}

function getSavedVariants() {
    const savedVariants = JSON.parse(localStorage.getItem('saved_variants')) || {};
    const savedQuantities = JSON.parse(localStorage.getItem('saved_quantities')) || {};
    const legacyOptions = { 330: 'Cereja', 331: 'Morango & Chantilly', 332: 'Flores Delicadas', 333: 'Rosa Mosqueta', 334: 'Algodão Doce', 335: 'Kit/Variados' };
    const legacyGelOptions = { 317: 'Amora', 318: 'Barbatimão e Flor de Algodão', 319: 'Pétalas de Rosas', 320: 'Roma e Aroeira', 321: 'Rosa Mosqueta', 322: 'Vanilla', 323: 'Pêssego' };
    let migrated = false;

    Object.entries(legacyOptions).forEach(([productId, option]) => {
        const quantity = Math.max(0, Number(savedQuantities[productId]) || 0);
        if (quantity > 0) {
            savedVariants[296] = savedVariants[296] || {};
            savedVariants[296][option] = (Number(savedVariants[296][option]) || 0) + quantity;
            delete savedQuantities[productId];
            migrated = true;
        }
    });

    Object.entries(legacyGelOptions).forEach(([productId, option]) => {
        const quantity = Math.max(0, Number(savedQuantities[productId]) || 0);
        if (quantity > 0) {
            savedVariants[316] = savedVariants[316] || {};
            savedVariants[316][option] = (Number(savedVariants[316][option]) || 0) + quantity;
            delete savedQuantities[productId];
            migrated = true;
        }
    });

    products.filter(product => product.price == null || product.available === false).forEach(product => {
        if (savedVariants[product.id] !== undefined) {
            delete savedVariants[product.id];
            migrated = true;
        }
    });

    if (migrated) {
        localStorage.setItem('saved_variants', JSON.stringify(savedVariants));
        localStorage.setItem('saved_quantities', JSON.stringify(savedQuantities));
    }

    return savedVariants;
}

function getVariantQuantity(productId, option) {
    const savedVariants = getSavedVariants();
    return Math.max(0, Number(savedVariants[productId]?.[option]) || 0);
}

function getProductQuantity(productId, savedQuantities = getSavedQuantities()) {
    const variantConfig = getProductVariantConfig(productId);
    if (!variantConfig) return Math.max(0, Number(savedQuantities[productId]) || 0);
    const savedVariants = getSavedVariants();
    return Object.values(savedVariants[productId] || {}).reduce((total, quantity) => total + Math.max(0, Number(quantity) || 0), 0);
}

function atualizarAlturaCheckout() {
    if (!checkoutBoxEl) return;
    document.documentElement.style.setProperty('--checkout-height', `${checkoutBoxEl.offsetHeight}px`);
}

if (checkoutBoxEl && 'ResizeObserver' in window) {
    new ResizeObserver(atualizarAlturaCheckout).observe(checkoutBoxEl);
}

function getProductDescription(product) {
    const name = product.name.toLocaleLowerCase();
    if (/sabonete|desodorante íntimo/.test(name)) return 'Produto de higiene e cuidado pessoal para uso diário. Confira a fragrância e a apresentação no nome do item.';
    if (/capilar|shampoo|condicionante|mary life|bio instinto|body splash|óleo|oleo|manteiga|creme/.test(name)) return 'Produto para cuidados pessoais, com apresentação e características descritas no nome do item.';
    if (/podox|pés|pedicure|podologia/.test(name)) return 'Produto para cuidados dos pés e rotina de podologia profissional.';
    return 'Produto disponível para pedido no catálogo Varejinho. Consulte a apresentação indicada no nome do item.';
}

function formatMoney(value) {
    return value == null ? 'Indisponível' : new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatProductPrice(price) {
    return price == null ? 'Indisponível' : `R$ ${price.toFixed(2).replace('.', ',')}`;
}

function getProductPrice(product, quantity = 0) {
    if (product.id === 306) return quantity >= 24 ? 31.99 : 33.99;
    return product.promoPrice ?? product.price;
}

function formatVisibleProductPrice(product, quantity = 0) {
    if (product.promoPrice != null && product.price != null && product.promoPrice < product.price) {
        return formatPromotionPrice(product, quantity);
    }
    return formatProductPrice(getProductPrice(product, quantity));
}

function formatPromotionPrice(product, quantity = 0) {
    const originalPrice = product.price;
    const promotionPrice = getProductPrice(product, quantity);
    if (promotionPrice == null) return formatProductPrice(originalPrice);
    const quantityNote = product.id === 306 ? '<small class="promotion-note">R$ 31,99 a partir de 24 un.</small>' : '';
    if (originalPrice == null || originalPrice <= promotionPrice) return `<strong class="promo-price">${formatProductPrice(promotionPrice)}</strong>${quantityNote}`;
    return `<del class="original-price">${formatProductPrice(originalPrice)}</del><strong class="promo-price">${formatProductPrice(promotionPrice)}</strong>${quantityNote}`;
}

function getPromotionNotice(product) {
    return product.id === 306 ? '<span class="promotion-notice">Compre 24 ou mais e ganhe desconto: R$ 31,99 cada.</span>' : '';
}

function getSavedQuantities() {
    const savedQuantities = JSON.parse(localStorage.getItem('saved_quantities')) || {};
    const unavailableIds = new Set(products
        .filter(product => product.price == null || product.available === false)
        .map(product => String(product.id)));
    let changed = false;

    unavailableIds.forEach(productId => {
        if (savedQuantities[productId] !== undefined) {
            delete savedQuantities[productId];
            changed = true;
        }
    });

    excludedSoapIds.forEach(productId => {
        if (savedQuantities[productId] !== undefined) {
            delete savedQuantities[productId];
            changed = true;
        }
    });

    if (changed) localStorage.setItem('saved_quantities', JSON.stringify(savedQuantities));
    return savedQuantities;
}

function getSelectedProducts() {
    const savedQuantities = getSavedQuantities();
    const savedVariants = getSavedVariants();

    return products.filter(product => !hiddenCatalogProductIds.has(product.id)).flatMap(product => {
        if (product.price == null || product.available === false) return [];
        const variantConfig = getProductVariantConfig(product.id);
        if (variantConfig) {
            const variantOptions = [...new Set([...variantConfig.options, ...Object.keys(savedVariants[product.id] || {})])];
            return variantOptions
                .filter(option => Number(savedVariants[product.id]?.[option]) > 0)
                .map(option => ({
                    ...product,
                    variant: option,
                    variantLabel: variantConfig.label,
                    quantity: Number(savedVariants[product.id][option]),
                    currentPrice: getProductPrice(product, Number(savedVariants[product.id][option]))
                }));
        }
        const quantity = Number(savedQuantities[product.id]) || 0;
        return quantity > 0 ? [{ ...product, quantity, currentPrice: getProductPrice(product, quantity) }] : [];
    });
}

function mascaraCNPJ(input) {
    let valor = input.value.replace(/\D/g, ''); 
    if (valor.length > 14) valor = valor.substring(0, 14);

    if (valor.length <= 2) {
        input.value = valor;
    } else if (valor.length <= 5) {
        input.value = valor.replace(/^(\d{2})(\d+)/, "$1.$2");
    } else if (valor.length <= 8) {
        input.value = valor.replace(/^(\d{2})(\d{3})(\d+)/, "$1.$2.$3");
    } else if (valor.length <= 12) {
        input.value = valor.replace(/^(\d{2})(\d{3})(\d{3})(\d+)/, "$1.$2.$3/$4");
    } else {
        input.value = valor.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    }
    localStorage.setItem('saved_cnpj', input.value);
}

function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g,'');
    if (cnpj.length !== 14) return false;
    if (/^([0-9])\1+$/.test(cnpj)) return false;

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(0)) return false;
       
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(1)) return false;
       
    return true;
}

function productMatchesCategory(product, category) {
    if (category === 'todos') return true;

    const name = product.name.toLocaleLowerCase();
    const brandCategories = {
        catarinense: name.includes('catarinense'),
        cosmeticos: /mary life|bio instinto|shampoo|condicionante|capilar|hidratante|desodorante|sabonete|óleo de coco|oleo de coco|pomada massageadora|protetor labial|body splash|manteiga de cacau|sebo de carneiro|podox|pés/.test(name),
    };

    return brandCategories[category] || false;
}

function normalizeSearchText(text) {
    return text
        .toLocaleLowerCase('pt-BR')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '');
}

function normalizeSearchWords(text) {
    return text
        .toLocaleLowerCase('pt-BR')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .split(/[^a-z0-9]+/)
        .filter(Boolean);
}

function renderProducts(searchTerm = '') {
    productListEl.innerHTML = '';
    const savedQuantities = getSavedQuantities();
    const savedCnpj = localStorage.getItem('saved_cnpj');
    const normalizedSearch = normalizeSearchText(searchTerm);
    const searchWords = normalizeSearchWords(searchTerm);
    const visibleProducts = (promotionsOnly ? promotions.map(promotion => {
        const product = products.find(item => item.id === promotion.productId);
        return product ? { ...product, promotionName: promotion.name || product.name } : null;
    }).filter(Boolean) : products)
        .filter(product => !hiddenCatalogProductIds.has(product.id))
        .filter(product => {
            const normalizedName = normalizeSearchText(product.name);
            const matchesSearch = normalizedName.includes(normalizedSearch) || searchWords.every(word => normalizedName.includes(word));
            return matchesSearch && (promotionsOnly || productMatchesCategory(product, activeCategory));
        })
        .sort((productA, productB) => {
            if (activeSort === 'price-asc') return (productA.price ?? Infinity) - (productB.price ?? Infinity) || productA.name.localeCompare(productB.name, 'pt-BR');
            return productA.name.localeCompare(productB.name, 'pt-BR');
        });

    if (savedCnpj && cnpjEl) cnpjEl.value = savedCnpj;

    if (productCountEl) {
        productCountEl.innerText = `${visibleProducts.length} ${visibleProducts.length === 1 ? 'item' : 'itens'}`;
    }

    if (catalogTitleEl) catalogTitleEl.innerText = promotionsOnly ? 'Ofertas por tempo limitado' : 'Encontre o que precisa';
    if (backToCatalogButtonEl) backToCatalogButtonEl.hidden = !promotionsOnly;

    if (visibleProducts.length === 0) {
        productListEl.innerHTML = '<div class="empty-state"><strong>Nenhum produto encontrado.</strong><br>Experimente buscar por outro nome ou marca.</div>';
        calculateTotal();
        return;
    }

    visibleProducts.forEach(product => {
        const isUnavailable = product.price == null || product.available === false;
        const isPromotion = product.promoPrice != null;
        const variantConfig = getProductVariantConfig(product.id);
        const savedQty = getProductQuantity(product.id, savedQuantities);
        const card = document.createElement('div');
        card.className = `product-card${isUnavailable ? ' product-card--unavailable' : ''}${isPromotion ? ' product-card--promotion' : ''}`;
        card.dataset.productId = product.id;
        card.addEventListener('click', event => {
            if (isUnavailable || event.target.closest('.product-controls')) return;
            abrirDetalhesProduto(product.id);
        });
        card.innerHTML = `
            <img class="product-image" src="${product.image}" alt="" loading="lazy" decoding="async" onerror="this.onerror=null; this.src='assets/images/branding/logo.png.jpg';">
            <div class="product-info">
                <div class="product-name">${product.promotionName || product.name}</div>
                <div class="product-price">${formatVisibleProductPrice(product, savedQty)}</div>
                ${getPromotionNotice(product)}
            </div>
            ${isUnavailable ? '<div class="stock-status">Indisponível</div>' : variantConfig ? `<div class="product-controls">
                <button type="button" class="variant-choice-button" onclick="abrirDetalhesProduto(${product.id})">Escolher opções${savedQty ? ` (${savedQty})` : ''}</button>
            </div>` : `<div class="product-controls">
                <label for="qty-${product.id}" style="font-size:0.9rem; color:#666;">Qtd:</label>
                <div class="quantity-stepper">
                    <button type="button" class="quantity-button" onclick="alterarQuantidadePedido(${product.id}, -1)" aria-label="Diminuir quantidade">−</button>
                    <input type="number" id="qty-${product.id}" min="0" value="${savedQty}" onchange="salvarEAtualizar(${product.id})" onkeyup="salvarEAtualizar(${product.id})" aria-label="Quantidade de ${product.name}">
                    <button type="button" class="quantity-button" onclick="alterarQuantidadePedido(${product.id}, 1)" aria-label="Aumentar quantidade">+</button>
                </div>
            </div>`}
        `;
        productListEl.appendChild(card);
    });

    calculateTotal();
}

async function loadProductAvailability() {
    if (!window.runTrainingSheets || !window.runTrainingSheets.isConfigured()) {
        if (stockSyncMessageEl) {
            stockSyncMessageEl.textContent = 'Não foi possível verificar a disponibilidade. Consulte a loja antes de enviar o pedido.';
            stockSyncMessageEl.hidden = false;
        }
        return;
    }

    if (stockSyncMessageEl) {
        stockSyncMessageEl.textContent = 'Verificando disponibilidade dos produtos...';
        stockSyncMessageEl.hidden = false;
        stockSyncMessageEl.classList.remove('is-error');
    }

    try {
        const result = await window.runTrainingSheets.syncProductAvailability(
            products
                .filter(product => !hiddenCatalogProductIds.has(product.id))
                .map(product => ({
                    id: product.id,
                    name: product.name,
                    forceUnavailable: product.price == null
                }))
        );
        if (result.imported === true && Array.isArray(result.catalog)) {
            const originalProducts = new Map(products.map(product => [product.id, product]));
            products.splice(0, products.length, ...result.catalog.map(product => {
                const original = originalProducts.get(Number(product.id));
                return {
                    ...(original || {}),
                    id: Number(product.id),
                    name: product.name,
                    price: Number(product.price) > 0 ? Number(product.price) : null,
                    available: product.available === true,
                    image: original && original.image
                        ? original.image
                        : 'assets/images/branding/logo.png.jpg'
                };
            }));
            hiddenCatalogProductIds.clear();
            excludedSoapIds.clear();
        }
        products.forEach(product => {
            const availability = result.availability[String(product.id)];
            const priceOverride = Number(result.prices[String(product.id)]);
            if (Number.isFinite(priceOverride) && priceOverride > 0) product.price = priceOverride;
            product.available = typeof availability === 'boolean' ? availability : true;
        });
        if (stockSyncMessageEl) stockSyncMessageEl.hidden = true;
        renderProducts(productSearchEl ? productSearchEl.value : '');
    } catch (error) {
        if (stockSyncMessageEl) {
            stockSyncMessageEl.textContent = `Não foi possível verificar a disponibilidade: ${error.message}`;
            stockSyncMessageEl.classList.add('is-error');
            stockSyncMessageEl.hidden = false;
        }
    }
}

function atualizarPrecoExibido(productId, quantity) {
    const product = products.find(item => item.id === productId);
    const card = document.querySelector(`[data-product-id="${productId}"] .product-price`);
    if (!product || !card) return;
    card.innerHTML = formatVisibleProductPrice(product, quantity);
}

function abrirDetalhesProduto(productId) {
    const product = products.find(item => item.id === productId);
    if (!product || product.price == null || product.available === false) return;

    activeProductId = productId;
    const savedQuantities = getSavedQuantities();
    const variantConfig = getProductVariantConfig(productId);
    const savedVariantOptions = variantConfig ? Object.keys(getSavedVariants()[productId] || {}) : [];
    productDetailTitleEl.innerText = product.name;
    productDetailDescriptionEl.innerText = getProductDescription(product);
    if (productDetailImageEl) {
        productDetailImageEl.src = product.image;
        productDetailImageEl.alt = `Imagem de ${product.name}`;
        productDetailImageEl.onerror = () => {
            productDetailImageEl.onerror = null;
            productDetailImageEl.src = 'assets/images/branding/logo.png.jpg';
        };
    }
    const detailQuantity = Math.max(1, Number(savedQuantities[productId]) || 1);
    productDetailPriceEl.innerHTML = `${formatVisibleProductPrice(product, detailQuantity)}${getPromotionNotice(product)}`;
    productDetailQuantityEl.value = Math.max(1, Number(savedQuantities[productId]) || 1);
    document.getElementById('detail-quantity-controls').hidden = Boolean(variantConfig);
    if (productDetailVariantsEl) {
        productDetailVariantsEl.hidden = !variantConfig;
        productDetailVariantsEl.innerHTML = variantConfig ? `
            <div class="variant-heading"><strong>Escolha ${variantConfig.label.toLocaleLowerCase()} e quantidade</strong><span>Você pode combinar opções</span></div>
            <div class="variant-list">
                ${[...new Set([...variantConfig.options, ...savedVariantOptions])].map(option => `
                    <label class="variant-row">
                        <span>${escapeHtml(option)}</span>
                        <input type="number" min="0" value="${getVariantQuantity(productId, option)}" data-variant-option="${escapeHtml(option)}" aria-label="Quantidade ${escapeHtml(option)}">
                    </label>
                `).join('')}
                ${variantConfig.allowCustom ? `
                    <label class="variant-custom-row">
                        <input type="text" data-variant-custom-name placeholder="${variantConfig.customLabel}" aria-label="${variantConfig.customLabel}">
                        <input type="number" min="0" value="0" data-variant-custom-quantity aria-label="Quantidade da opção personalizada">
                    </label>
                ` : ''}
            </div>
        ` : '';
    }
    productDetailPanelEl.classList.add('is-open');
    productDetailPanelEl.setAttribute('aria-hidden', 'false');
}

function fecharDetalhesProduto() {
    productDetailPanelEl.classList.remove('is-open');
    productDetailPanelEl.setAttribute('aria-hidden', 'true');
    activeProductId = null;
}

function alterarQuantidadeDetalhe(variation) {
    const currentQuantity = Math.max(1, Number(productDetailQuantityEl.value) || 1);
    const nextQuantity = Math.max(1, currentQuantity + variation);
    productDetailQuantityEl.value = nextQuantity;
    const product = products.find(item => item.id === activeProductId);
    if (product) {
        productDetailPriceEl.innerHTML = `${promotionsOnly ? formatPromotionPrice(product, nextQuantity) : formatProductPrice(getProductPrice(product, nextQuantity))}${getPromotionNotice(product)}`;
    }
}

function adicionarProdutoDetalhes() {
    if (!activeProductId) return;
    const product = products.find(item => item.id === activeProductId);
    if (!product || product.price == null || product.available === false) return;
    const variantConfig = getProductVariantConfig(activeProductId);
    const savedQuantities = getSavedQuantities();
    if (variantConfig) {
        const selectedVariants = {};
        productDetailVariantsEl.querySelectorAll('[data-variant-option]').forEach(input => {
            const quantity = Math.max(0, parseInt(input.value, 10) || 0);
            input.value = quantity;
            if (quantity > 0) selectedVariants[input.dataset.variantOption] = quantity;
        });
        const customNameInput = productDetailVariantsEl.querySelector('[data-variant-custom-name]');
        const customQuantityInput = productDetailVariantsEl.querySelector('[data-variant-custom-quantity]');
        const customName = customNameInput?.value.trim();
        const customQuantity = Math.max(0, parseInt(customQuantityInput?.value, 10) || 0);
        if (customName && customQuantity > 0) selectedVariants[customName] = customQuantity;
        if (Object.keys(selectedVariants).length === 0) {
            alert(`Informe a quantidade de pelo menos uma opção de ${variantConfig.label.toLocaleLowerCase()}.`);
            return;
        }
        const savedVariants = getSavedVariants();
        savedVariants[activeProductId] = selectedVariants;
        localStorage.setItem('saved_variants', JSON.stringify(savedVariants));
    } else {
        const quantity = Math.max(1, parseInt(productDetailQuantityEl.value, 10) || 1);
        savedQuantities[activeProductId] = quantity;
    }
    localStorage.setItem('saved_quantities', JSON.stringify(savedQuantities));
    renderProducts(productSearchEl ? productSearchEl.value : '');
    fecharDetalhesProduto();
}

function salvarEAtualizar(productId, inputElement) {
    const product = products.find(item => item.id === productId);
    const input = inputElement || document.getElementById(`qty-${productId}`);
    if (!product || product.price == null) return;
    let savedQuantities = JSON.parse(localStorage.getItem('saved_quantities')) || {};
    const quantity = Math.max(0, parseInt(input.value, 10) || 0);
    input.value = quantity;
    savedQuantities[productId] = quantity;
    localStorage.setItem('saved_quantities', JSON.stringify(savedQuantities));
    atualizarPrecoExibido(productId, quantity);
    calculateTotal();
    renderOrderSummary();
}

function alterarQuantidadePedido(productId, variation) {
    const product = products.find(item => item.id === productId);
    if (!product || product.price == null) return;
    if (getProductVariantConfig(productId)) {
        abrirDetalhesProduto(productId);
        return;
    }
    const savedQuantities = getSavedQuantities();
    const currentQuantity = Math.max(0, Number(savedQuantities[productId]) || 0);
    const nextQuantity = Math.max(0, currentQuantity + variation);
    savedQuantities[productId] = nextQuantity;
    localStorage.setItem('saved_quantities', JSON.stringify(savedQuantities));

    const catalogInput = document.getElementById(`qty-${productId}`);
    if (catalogInput) catalogInput.value = nextQuantity;
    atualizarPrecoExibido(productId, nextQuantity);

    calculateTotal();
    renderOrderSummary();
}

function salvarVarianteEAtualizar(productId, option, input) {
    option = decodeURIComponent(option);
    const savedVariants = getSavedVariants();
    const quantity = Math.max(0, parseInt(input.value, 10) || 0);
    input.value = quantity;
    savedVariants[productId] = savedVariants[productId] || {};
    if (quantity > 0) savedVariants[productId][option] = quantity;
    else delete savedVariants[productId][option];
    localStorage.setItem('saved_variants', JSON.stringify(savedVariants));
    renderProducts(productSearchEl ? productSearchEl.value : '');
    calculateTotal();
}

function alterarQuantidadeVariante(productId, option, variation) {
    option = decodeURIComponent(option);
    const nextQuantity = Math.max(0, getVariantQuantity(productId, option) + variation);
    const savedVariants = getSavedVariants();
    savedVariants[productId] = savedVariants[productId] || {};
    if (nextQuantity > 0) savedVariants[productId][option] = nextQuantity;
    else delete savedVariants[productId][option];
    localStorage.setItem('saved_variants', JSON.stringify(savedVariants));
    calculateTotal();
    renderOrderSummary();
}

function renderOrderSummary() {
    const selectedProducts = getSelectedProducts();
    const totalUnits = selectedProducts.reduce((sum, product) => sum + product.quantity, 0);

    if (selectedCountEl) selectedCountEl.innerText = selectedProducts.length;
    if (orderItemCountEl) {
        orderItemCountEl.innerText = `${selectedProducts.length} ${selectedProducts.length === 1 ? 'item' : 'itens'} selecionado${selectedProducts.length === 1 ? '' : 's'} · ${totalUnits} ${totalUnits === 1 ? 'unidade' : 'unidades'}`;
    }
    if (orderTotalEl) {
        const orderTotal = selectedProducts.reduce((sum, product) => sum + product.quantity * (product.currentPrice ?? 0), 0);
        orderTotalEl.innerText = orderTotal.toFixed(2).replace('.', ',');
    }

    if (!orderItemsEl) return;
    if (selectedProducts.length === 0) {
        orderItemsEl.innerHTML = '<div class="order-empty">Nenhum item selecionado ainda.<br>Volte ao catálogo e escolha os produtos do pedido.</div>';
        return;
    }

    orderItemsEl.innerHTML = selectedProducts.map(product => {
        const hasPromo = product.promoPrice != null && product.price != null && product.promoPrice < product.price;
        const promoLabel = hasPromo
            ? `Preço unit.: <span class="order-price-current">${formatProductPrice(product.promoPrice)}</span> <span class="order-price-old">${formatProductPrice(product.price)}</span>`
            : `Preço unit.: ${formatProductPrice(product.currentPrice ?? product.price)}`;

        return `
        <article class="order-item">
            <div class="order-item-info">
                <strong>${product.name}${product.variant ? ` <small>${escapeHtml(product.variantLabel)}: ${escapeHtml(product.variant)}</small>` : ''}</strong>
                <span>${promoLabel}</span>
                <span>Subtotal: ${formatProductPrice(product.currentPrice == null ? null : product.quantity * product.currentPrice)}</span>
            </div>
            <div class="quantity-stepper" aria-label="Quantidade de ${product.name}">
                <button type="button" class="quantity-button" onclick="${product.variant ? `alterarQuantidadeVariante(${product.id}, '${encodeVariantOption(product.variant)}', -1)` : `alterarQuantidadePedido(${product.id}, -1)`}" aria-label="Diminuir quantidade">−</button>
                <input type="number" min="0" value="${product.quantity}" onchange="${product.variant ? `salvarVarianteEAtualizar(${product.id}, '${encodeVariantOption(product.variant)}', this)` : `salvarEAtualizar(${product.id}, this)`}" aria-label="Quantidade de ${product.name}${product.variant ? ` ${product.variant}` : ''}">
                <button type="button" class="quantity-button" onclick="${product.variant ? `alterarQuantidadeVariante(${product.id}, '${encodeVariantOption(product.variant)}', 1)` : `alterarQuantidadePedido(${product.id}, 1)`}" aria-label="Aumentar quantidade">+</button>
            </div>
        </article>
    `;
    }).join('');
}

function limparPedido() {
    const keysToClear = ['saved_quantities', 'saved_variants', 'saved_pagamento'];
    keysToClear.forEach(key => localStorage.removeItem(key));
    renderProducts(productSearchEl ? productSearchEl.value : '');
    calculateTotal();
}

function abrirPedido() {
    renderOrderSummary();
    orderPanelEl.classList.add('is-open');
    orderPanelEl.setAttribute('aria-hidden', 'false');
    document.body.classList.add('order-is-open');
    calculateTotal();
}

function fecharPedido() {
    orderPanelEl.classList.remove('is-open');
    orderPanelEl.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('order-is-open');
    calculateTotal();
}

function atualizarOpcoesPagamento(total) {
    const savedPagamento = localStorage.getItem('saved_pagamento');
    condicaoPagamentoEl.innerHTML = '';

    const qtdBoletosPermitidos = Math.floor(total / 300);

    if (qtdBoletosPermitidos < 1) {
        const opt = document.createElement('option');
        opt.value = "";
        opt.innerText = "Atingir mínimo de R$ 300,00 para liberar opções";
        condicaoPagamentoEl.appendChild(opt);
        return;
    }

    const opcoesDisponiveis = condicoesPagamento.filter(op => op.boletos <= qtdBoletosPermitidos);

    if (opcoesDisponiveis.length === 0) {
        const opt = document.createElement('option');
        opt.value = "";
        opt.innerText = "Nenhuma opção disponível para este valor";
        condicaoPagamentoEl.appendChild(opt);
        return;
    }

    opcoesDisponiveis.forEach(op => {
        const option = document.createElement('option');
        option.value = op.nome;
        option.innerText = op.nome;
        if (savedPagamento === op.nome) {
            option.selected = true;
        }
        condicaoPagamentoEl.appendChild(option);
    });

    localStorage.setItem('saved_pagamento', condicaoPagamentoEl.value);
}

if (condicaoPagamentoEl) {
    condicaoPagamentoEl.addEventListener('change', () => {
        localStorage.setItem('saved_pagamento', condicaoPagamentoEl.value);
    });
}

if (productSearchEl) {
    productSearchEl.addEventListener('input', () => renderProducts(productSearchEl.value));
}

function abrirPromocoes() {
    promotionsOnly = true;
    activeCategory = 'todos';
    if (productSearchEl) productSearchEl.value = '';
    categoryFilterEls.forEach(button => button.classList.toggle('is-active', button.dataset.category === 'todos'));
    renderProducts();
    loadProductAvailability();
    document.querySelector('.catalog-toolbar')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function fecharPromocoes() {
    promotionsOnly = false;
    if (productSearchEl) productSearchEl.value = '';
    renderProducts();
}

if (openPromotionsButtonEl) openPromotionsButtonEl.addEventListener('click', abrirPromocoes);
if (backToCatalogButtonEl) backToCatalogButtonEl.addEventListener('click', fecharPromocoes);

if (productSortEl) {
    productSortEl.addEventListener('change', () => {
        activeSort = productSortEl.value;
        renderProducts(productSearchEl ? productSearchEl.value : '');
    });
}

categoryFilterEls.forEach(filterButton => {
    filterButton.addEventListener('click', () => {
        activeCategory = filterButton.dataset.category;
        categoryFilterEls.forEach(button => button.classList.toggle('is-active', button === filterButton));
        renderProducts(productSearchEl ? productSearchEl.value : '');
    });
});

function calculateTotal() {
    const selectedProducts = getSelectedProducts();
    const total = selectedProducts.reduce((sum, product) => sum + product.quantity * (product.currentPrice ?? 0), 0);
    const itensSelecionados = selectedProducts.reduce((sum, product) => sum + product.quantity, 0);

    if (totalValEl) totalValEl.innerText = total.toFixed(2).replace('.', ',');
    if (floatingTotalEl) floatingTotalEl.innerText = total.toFixed(2).replace('.', ',');
    if (selectedUnitsEl) selectedUnitsEl.innerText = itensSelecionados;

    if (minWarningEl) {
        if (total < 300.00) {
            minWarningEl.style.display = 'block';
        } else {
            minWarningEl.style.display = 'none';
        }
    }

    const hasItems = itensSelecionados > 0;
    const isViewingOrder = orderPanelEl.classList.contains('is-open');
    checkoutBoxEl.style.display = hasItems && isViewingOrder ? 'block' : 'none';
    floatingOrderBarEl.classList.toggle('is-visible', hasItems && !isViewingOrder);

    atualizarOpcoesPagamento(total);
    renderOrderSummary();
    return total;
}

async function enviarPedido() {
    if (window.enviandoPedido) return;
    const cnpjValue = cnpjEl.value.trim();
    if (!cnpjValue) {
        alert('Por favor, preencha o campo CNPJ antes de enviar o pedido.');
        cnpjEl.focus();
        return;
    }

    if (!validarCNPJ(cnpjValue)) {
        alert('O CNPJ digitado é inválido. Por favor, verifique os números.');
        cnpjEl.focus();
        return;
    }

    const total = calculateTotal();
    if (total < 300.00) {
        alert('O valor mínimo para o pedido é de R$ 300,00.');
        return;
    }

    const condicaoPagamento = condicaoPagamentoEl.value;
    if (!condicaoPagamento) {
        alert('Por favor, selecione uma condição de pagamento válida.');
        return;
    }

    let mensagem = `*NOVO PEDIDO - RUN TRAINING*\n\n*CNPJ:* ${cnpjValue}\n*Condição de Pagamento:* ${condicaoPagamento}\n\n*Itens do Pedido:*`;
    let itensCount = 0;

    getSelectedProducts().forEach(product => {
        const variantText = product.variant ? ` | ${product.variantLabel}: ${product.variant}` : '';
        const unitPrice = product.currentPrice ?? product.price ?? 0;
        const isPromotion = product.price != null && product.promoPrice != null && product.promoPrice < product.price;
        const unidadeTexto = isPromotion
            ? ` | Unit.: *${formatMoney(unitPrice)}*`
            : ` | Unit.: ${formatMoney(unitPrice)}`;
        const subtotal = formatMoney(product.quantity * unitPrice);
        mensagem += `\n• ${product.name}${variantText}${unidadeTexto} | Qtd: ${product.quantity} | Subtotal: ${subtotal}`;
        itensCount++;
    });

    if (itensCount === 0) {
        alert('Selecione pelo menos um produto para enviar o pedido.');
        return;
    }

    mensagem += `\n\n*VALOR TOTAL:* ${formatMoney(total)}`;

    const numeroWhatsApp = getWhatsAppDestinatario();
    if (!numeroWhatsApp) {
        alert('O WhatsApp deste link ainda não foi configurado.');
        return;
    }
    const isMobileOuTablet = /Android|iPhone|iPad|iPod|Mobile|Tablet/i.test(navigator.userAgent)
        || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const textoCodificado = encodeURIComponent(mensagem);
    const url = isMobileOuTablet
        ? `https://wa.me/${numeroWhatsApp}?text=${textoCodificado}`
        : `https://web.whatsapp.com/send?phone=${numeroWhatsApp}&text=${textoCodificado}`;

    const salesRecord = {
        seller_key: new URLSearchParams(window.location.search).get('destino') === 'vanderson' ? 'vanderson' : 'gabriel',
        cnpj: cnpjValue,
        total: Math.round(total * 100) / 100,
        payment_condition: condicaoPagamento,
        items: getSelectedProducts().map(product => ({
            name: product.name,
            quantity: product.quantity,
            unit_price: Math.round((product.currentPrice ?? product.price ?? 0) * 100) / 100,
            variant: product.variant || null
        }))
    };

    const whatsappWindow = window.open(url, '_blank');
    if (whatsappWindow) whatsappWindow.opener = null;

    window.enviandoPedido = true;
    let saleSaved = false;

    try {
        const saveResult = typeof window.recordAdminSale === 'function'
            ? await window.recordAdminSale(salesRecord)
            : { saved: false, reason: 'A integração com o banco de vendas ainda não foi configurada.' };

        if (!saveResult.saved) throw new Error(saveResult.reason);
        saleSaved = true;
    } catch (error) {
        const message = error && error.message ? error.message : 'Erro desconhecido ao salvar o pedido.';
        const destination = whatsappWindow
            ? 'O WhatsApp foi aberto em outra aba'
            : 'O WhatsApp será aberto nesta aba porque o navegador bloqueou a nova aba';
        alert(`${destination}, mas o pedido não foi registrado no histórico: ${message}`);
    } finally {
        window.enviandoPedido = false;
    }

    if (saleSaved) limparPedido();
    if (!whatsappWindow) window.location.href = url;
}

if (viewOrderButtonEl) viewOrderButtonEl.addEventListener('click', abrirPedido);

document.querySelectorAll('[data-close-order]').forEach(element => {
    element.addEventListener('click', fecharPedido);
});
document.querySelectorAll('[data-close-product]').forEach(element => {
    element.addEventListener('click', fecharDetalhesProduto);
});
document.getElementById('detail-decrease').addEventListener('click', () => alterarQuantidadeDetalhe(-1));
document.getElementById('detail-increase').addEventListener('click', () => alterarQuantidadeDetalhe(1));
addProductButtonEl.addEventListener('click', adicionarProdutoDetalhes);

document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && orderPanelEl.classList.contains('is-open')) fecharPedido();
    if (event.key === 'Escape' && productDetailPanelEl.classList.contains('is-open')) fecharDetalhesProduto();
});

renderProducts();
renderOrderSummary();
loadProductAvailability();
