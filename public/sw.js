const CACHE_NAME = 'agrishield-pwa-v2';

// Core shell assets to pre-cache on install
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-maskable-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const asset of PRECACHE_ASSETS) {
        try {
          await cache.add(asset);
        } catch (err) {
          console.warn('AgriShield PWA asset pre-cache skipped:', asset, err);
        }
      }
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('AgriShield PWA purging legacy cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // 1. Only handle GET requests
  if (request.method !== 'GET') {
    return;
  }

  // 2. Never cache or intercept dynamic AI diagnosis or development Webpack HMR
  if (
    url.pathname.startsWith('/api/diagnose') ||
    url.pathname.includes('/_next/webpack-hmr') ||
    url.pathname.includes('/_next/static/webpack/')
  ) {
    return;
  }

  // 3. Cloudflare R2 CDN Images & Media: Cache-First with Network Fallback
  const isCdnImage = url.hostname.includes('r2.dev') || url.hostname.includes('cloudflarestorage.com');
  const isImageRequest =
    request.destination === 'image' ||
    url.pathname.match(/\.(jpg|jpeg|png|webp|svg|gif|ico)$/i) ||
    isCdnImage;

  if (isImageRequest) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }

        try {
          const networkResponse = await fetch(request);
          if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (err) {
          // If offline and full image was not downloaded yet, fallback to cached thumbnail
          if (url.pathname.endsWith('.jpg') && !url.pathname.includes('_thumb')) {
            const thumbUrl = request.url.replace(/.jpg$/, '_thumb.jpg');
            const cachedThumb = await cache.match(thumbUrl);
            if (cachedThumb) {
              return cachedThumb;
            }
          }
          return cachedResponse || new Response('', { status: 408 });
        }
      })
    );
    return;
  }

  // 4. Next.js Static Chunks (_next/static/*, fonts, CSS): Stale-While-Revalidate
  if (url.origin === self.location.origin && url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 5. HTML Page Navigation (/): Network-First with Offline Cache Fallback
  if (
    request.mode === 'navigate' ||
    (request.headers.get('accept') && request.headers.get('accept').includes('text/html'))
  ) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cachedPage = (await caches.match(request)) || (await caches.match('/'));
          if (cachedPage) {
            return cachedPage;
          }
          return new Response(
            '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AgriShield AI - Offline</title><style>body{font-family:system-ui,-apple-system,sans-serif;padding:2rem;text-align:center;background:#f8fafc;color:#0f172a}h1{color:#065f46;margin-bottom:.5rem}.card{background:#fff;border-radius:1.5rem;padding:2rem;box-shadow:0 4px 6px -1px rgba(0,0,0,.05);max-width:480px;margin:2rem auto}button{background:#059669;color:#fff;border:none;padding:.75rem 1.5rem;border-radius:.75rem;font-weight:700;cursor:pointer}</style></head><body><div class="card"><h1>🌱 AgriShield AI</h1><p>You are currently offline. Saved diagnoses and prescriptions remain viewable in your Offline Vault.</p><br><button onclick="window.location.reload()">Reload App</button></div></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        })
    );
    return;
  }

  // 6. Default Same-Origin Requests: Network-First with Cache Fallback
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          return new Response('Network error occurred', {
            status: 408,
            headers: { 'Content-Type': 'text/plain' },
          });
        })
    );
  }
});
