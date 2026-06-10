// ============================================================
// MANMADHAN'S HUB — Service Worker (Offline Support)
// ============================================================

const CACHE_VERSION = 'v1';
const SHELL_CACHE = `hub-shell-${CACHE_VERSION}`;
const API_CACHE = `hub-api-${CACHE_VERSION}`;

// App shell assets to pre-cache on install
const SHELL_ASSETS = [
  '/',
  '/dashboard',
  '/manifest.json',
  '/favicon.ico',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/error/offline',
];

// ── Install: pre-cache shell ──────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => {
      return cache.addAll(SHELL_ASSETS).catch((err) => {
        console.warn('[SW] Shell pre-cache partial failure:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// ── Activate: clean old caches ────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== SHELL_CACHE && k !== API_CACHE)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: strategy per request type ─────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Disable caching on localhost/development environment to avoid HMR and Next.js static chunks caching
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
    return;
  }

  // Skip non-GET, chrome-extension, and socket.io requests
  if (
    request.method !== 'GET' ||
    url.protocol === 'chrome-extension:' ||
    url.pathname.startsWith('/socket.io')
  ) {
    return;
  }

  // API requests: Network-first, fall back to cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstWithCache(request, API_CACHE));
    return;
  }

  // Next.js static assets (_next/static): Cache-first
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(request, SHELL_CACHE));
    return;
  }

  // Navigation requests (HTML pages): Network-first, fall back to shell or offline page
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match(request).then((cached) =>
          cached ||
          caches.match('/') ||
          caches.match('/error/offline')
        )
      )
    );
    return;
  }

  // Everything else: Network-first with shell cache fallback
  event.respondWith(networkFirstWithCache(request, SHELL_CACHE));
});

// ── Strategy: Network-first, cache on success ─────────────
async function networkFirstWithCache(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    const cached = await caches.match(request);
    return cached || new Response(
      JSON.stringify({ error: 'offline', offline: true }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// ── Strategy: Cache-first, network fallback ───────────────
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    return new Response('', { status: 503 });
  }
}

// ── Message: force cache refresh ─────────────────────────
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// ── Push: receive server push and show notification ───────
self.addEventListener('push', (event) => {
  let data = { title: "Manmadhan's Hub", body: 'You have a new notification.', url: '/dashboard' };
  try {
    if (event.data) data = { ...data, ...event.data.json() };
  } catch (e) {}

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      tag: 'hub-notification',
      renotify: true,
      data: { url: data.url || '/dashboard' },
      actions: [
        { action: 'open', title: 'Open Dashboard' },
        { action: 'dismiss', title: 'Dismiss' }
      ]
    })
  );
});

// ── NotificationClick: focus or open the dashboard ────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const targetUrl = event.notification.data?.url || '/dashboard';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      // If dashboard is already open, focus it
      const existing = clients.find(c => c.url.includes('/dashboard'));
      if (existing) return existing.focus();
      // Otherwise open a new window
      return self.clients.openWindow(targetUrl);
    })
  );
});
