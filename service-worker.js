const CACHE_NAME = 'run-training-v43';
const APP_SHELL = [
    './',
    './index.html',
    './admin.html',
    './assets/css/style.css',
    './assets/css/admin.css',
    './assets/js/app.js',
    './assets/js/catalog-data.js',
    './assets/js/admin.js',
    './assets/js/sheets-config.js',
    './assets/js/sheets-client.js',
    './assets/images/branding/logo.png.jpg',
    './assets/pwa/pwa-icon-192.png',
    './assets/pwa/pwa-icon-512.png',
    './manifest.json'
];

self.addEventListener('install', event => {
    event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
        ))
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request)
            .then(response => {
                const copy = response.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});

self.addEventListener('push', event => {
    if (!event.data) return;
    let payload;
    try {
        payload = event.data.json();
    } catch (error) {
        console.error('Payload de notificação push inválido.', error);
        return;
    }
    if (!payload || typeof payload !== 'object') {
        console.error('Payload de notificação push sem conteúdo válido.');
        return;
    }

    const notification = payload.notification || {};
    const data = payload.data || {};
    const body = notification.body
        || [data.companyName, data.total].filter(Boolean).join(' • ');
    event.waitUntil(self.registration.showNotification(notification.title || 'Nova venda do Gabriel', {
        body: body,
        icon: './assets/pwa/pwa-icon-192.png',
        badge: './assets/pwa/pwa-icon-192.png',
        data: { url: './admin.html' }
    }));
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    const targetUrl = new URL('./admin.html', self.registration.scope).href;
    event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
        const existingClient = windowClients.find(client => new URL(client.url).origin === self.location.origin);
        if (existingClient) {
            return existingClient.navigate(targetUrl).then(() => existingClient.focus());
        }
        return clients.openWindow(targetUrl);
    }));
});
