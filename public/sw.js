/* eslint-disable no-restricted-globals */

/**
 * Raf</>Console Studio offline worker.
 *
 * Guaranteed offline routes after the first successful online installation:
 * - /bored_ru
 * - /bored
 * - /privacy_policy_ru
 * - /privacy_policy
 *
 * The worker also caches the page-specific Next.js chunks, styles, fonts and
 * the game audio files needed by those routes.
 */

const CACHE_VERSION = 'raf-console-essential-offline-2026-07-26-v2';
const DOCUMENT_CACHE = `${CACHE_VERSION}-documents`;
const ASSET_CACHE = `${CACHE_VERSION}-assets`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

const OFFLINE_FALLBACK = '/offline.html';

const ESSENTIAL_ROUTES = Object.freeze([
  '/bored_ru',
  '/bored',
  '/privacy_policy_ru',
  '/privacy_policy',
]);

const ESSENTIAL_ASSETS = Object.freeze([
  OFFLINE_FALLBACK,
  '/offline.css',
  '/offline.js',
  '/manifest.webmanifest',
  '/logo.svg',
  '/sounds/ShortShock1.mp3',
  '/sounds/HadShoatShock.mp3',
  '/sounds/LongShock1.mp3',
  '/sounds/LongShock2.mp3',
  '/sounds/LongShock3.mp3',
]);

const CACHE_NAMES = new Set([
  DOCUMENT_CACHE,
  ASSET_CACHE,
  RUNTIME_CACHE,
]);

function normalizePathname(pathname) {
  if (!pathname || pathname === '/') {
    return '/';
  }

  return pathname.replace(/\/+$/, '');
}

function isEssentialPath(pathname) {
  return ESSENTIAL_ROUTES.includes(normalizePathname(pathname));
}

function toSameOriginUrl(value, baseUrl) {
  try {
    const url = new URL(value, baseUrl);

    if (url.origin !== self.location.origin) {
      return null;
    }

    return url;
  } catch {
    return null;
  }
}

function extractHtmlAssetUrls(html, baseUrl) {
  const urls = new Set();
  const attributePattern = /(?:src|href)=["']([^"']+)["']/gi;

  for (const match of html.matchAll(attributePattern)) {
    const value = match[1];

    if (
      !value ||
      value.startsWith('#') ||
      value.startsWith('data:') ||
      value.startsWith('blob:') ||
      value.startsWith('mailto:') ||
      value.startsWith('tel:') ||
      value.startsWith('javascript:')
    ) {
      continue;
    }

    const url = toSameOriginUrl(value, baseUrl);

    if (url) {
      urls.add(url.href);
    }
  }

  return [...urls];
}

function extractCssAssetUrls(css, baseUrl) {
  const urls = new Set();
  const cssUrlPattern = /url\(\s*["']?([^"')]+)["']?\s*\)/gi;

  for (const match of css.matchAll(cssUrlPattern)) {
    const value = match[1]?.trim();

    if (
      !value ||
      value.startsWith('data:') ||
      value.startsWith('blob:') ||
      value.startsWith('#')
    ) {
      continue;
    }

    const url = toSameOriginUrl(value, baseUrl);

    if (url) {
      urls.add(url.href);
    }
  }

  return [...urls];
}

async function fetchWithTimeout(request, timeoutMs = 4500) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(request, {
      signal: controller.signal,
      cache: 'no-store',
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

async function cacheAsset(urlValue, visited = new Set()) {
  const url = toSameOriginUrl(urlValue, self.location.origin);

  if (!url || visited.has(url.href)) {
    return;
  }

  visited.add(url.href);

  const assetCache = await caches.open(ASSET_CACHE);
  const existing = await assetCache.match(url.href, {
    ignoreSearch: false,
  });

  if (existing) {
    return;
  }

  const response = await fetch(url.href, {
    credentials: 'same-origin',
    cache: 'reload',
  });

  if (!response.ok && response.type !== 'opaque') {
    throw new Error(`Unable to cache asset: ${url.href}`);
  }

  await assetCache.put(url.href, response.clone());

  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('text/css')) {
    const css = await response.text();
    const nestedAssets = extractCssAssetUrls(css, url.href);

    await Promise.allSettled(
      nestedAssets.map((nestedUrl) => cacheAsset(nestedUrl, visited))
    );
  }
}

async function cacheDocument(pathname) {
  const normalizedPath = normalizePathname(pathname);
  const pageUrl = new URL(normalizedPath, self.location.origin);

  const response = await fetch(pageUrl.href, {
    credentials: 'same-origin',
    cache: 'reload',
    headers: {
      'x-raf-offline-warmup': '1',
    },
  });

  if (!response.ok) {
    throw new Error(`Unable to cache route: ${normalizedPath}`);
  }

  const documentCache = await caches.open(DOCUMENT_CACHE);
  await documentCache.put(normalizedPath, response.clone());

  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('text/html')) {
    return;
  }

  const html = await response.text();
  const assets = extractHtmlAssetUrls(html, pageUrl.href);

  await Promise.allSettled(
    assets.map((assetUrl) => cacheAsset(assetUrl))
  );
}

async function warmEssentialOfflineContent() {
  await Promise.allSettled([
    ...ESSENTIAL_ASSETS.map((asset) => cacheAsset(asset)),
    ...ESSENTIAL_ROUTES.map((route) => cacheDocument(route)),
  ]);

  const clientsList = await self.clients.matchAll({
    includeUncontrolled: true,
    type: 'window',
  });

  for (const client of clientsList) {
    client.postMessage({
      type: 'RAF_OFFLINE_CONTENT_READY',
      routes: ESSENTIAL_ROUTES,
    });
  }
}

async function updateEssentialDocument(request, cacheKey) {
  const response = await fetchWithTimeout(request, 5000);

  if (!response.ok) {
    throw new Error(`Network response failed: ${request.url}`);
  }

  const documentCache = await caches.open(DOCUMENT_CACHE);
  await documentCache.put(cacheKey, response.clone());

  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('text/html')) {
    const html = await response.clone().text();
    const assets = extractHtmlAssetUrls(html, request.url);

    await Promise.allSettled(
      assets.map((assetUrl) => cacheAsset(assetUrl))
    );
  }

  return response;
}

async function handleEssentialNavigation(event) {
  const requestUrl = new URL(event.request.url);
  const cacheKey = normalizePathname(requestUrl.pathname);
  const documentCache = await caches.open(DOCUMENT_CACHE);
  const cached = await documentCache.match(cacheKey);

  try {
    return await updateEssentialDocument(event.request, cacheKey);
  } catch {
    if (cached) {
      return cached;
    }

    const fallback = await caches.match(OFFLINE_FALLBACK);

    if (fallback) {
      return fallback;
    }

    return new Response('Offline', {
      status: 503,
      headers: {
        'content-type': 'text/plain; charset=utf-8',
      },
    });
  }
}

async function handleGeneralNavigation(event) {
  try {
    const response = await fetchWithTimeout(event.request, 5000);

    if (response.ok) {
      const runtimeCache = await caches.open(RUNTIME_CACHE);
      await runtimeCache.put(event.request, response.clone());
    }

    return response;
  } catch {
    const runtimeMatch = await caches.match(event.request);

    if (runtimeMatch) {
      return runtimeMatch;
    }

    const fallback = await caches.match(OFFLINE_FALLBACK);

    if (fallback) {
      return fallback;
    }

    return new Response('Offline', {
      status: 503,
      headers: {
        'content-type': 'text/plain; charset=utf-8',
      },
    });
  }
}

async function handleStaticAsset(event) {
  const cached = await caches.match(event.request);

  if (cached) {
    event.waitUntil(
      fetch(event.request)
        .then(async (response) => {
          if (!response.ok) {
            return;
          }

          const assetCache = await caches.open(ASSET_CACHE);
          await assetCache.put(event.request, response);
        })
        .catch(() => undefined)
    );

    return cached;
  }

  try {
    const response = await fetch(event.request);

    if (response.ok) {
      const assetCache = await caches.open(ASSET_CACHE);
      await assetCache.put(event.request, response.clone());
    }

    return response;
  } catch {
    return new Response('', {
      status: 504,
      statusText: 'Offline asset unavailable',
    });
  }
}

self.addEventListener('install', (event) => {
  self.skipWaiting();

  event.waitUntil(warmEssentialOfflineContent());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter(
              (cacheName) =>
                cacheName.startsWith('raf-console-essential-offline-') &&
                !CACHE_NAMES.has(cacheName)
            )
            .map((cacheName) => caches.delete(cacheName))
        )
      ),
    ])
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'RAF_WARM_ESSENTIAL_ROUTES') {
    event.waitUntil(warmEssentialOfflineContent());
  }

  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === 'navigate') {
    if (isEssentialPath(url.pathname)) {
      event.respondWith(handleEssentialNavigation(event));
      return;
    }

    event.respondWith(handleGeneralNavigation(event));
    return;
  }

  const isStaticAsset =
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/sounds/') ||
    url.pathname === '/logo.svg' ||
    url.pathname === '/manifest.webmanifest' ||
    ['style', 'script', 'font', 'image', 'audio', 'video'].includes(
      request.destination
    );

  if (isStaticAsset) {
    event.respondWith(handleStaticAsset(event));
  }
});
