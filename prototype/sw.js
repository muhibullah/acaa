// HomeLearn Bridge offline support.
// Keeps a copy of the prototype pages so they open without internet. Pages are
// fetched fresh when online (so updates show straight away) and served from the
// copy when offline. Fonts are cached the first time they load.
const CACHE = 'hlb-v1';
const PAGES = [
  './', './children/', './platform/', './admin/', './shared/posts.js',
  './children/manifest.webmanifest', './children/icon-192.png', './children/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PAGES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Fonts: use the saved copy if there is one, otherwise download and save it.
  if (url.hostname.endsWith('fonts.googleapis.com') || url.hostname.endsWith('fonts.gstatic.com')) {
    e.respondWith(caches.open(CACHE).then(c => c.match(req).then(hit => hit ||
      fetch(req).then(res => { c.put(req, res.clone()); return res; }))));
    return;
  }
  if (url.origin !== location.origin) return;

  // Our own pages and files: try the network first, fall back to the saved copy.
  e.respondWith(fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  }).catch(() => caches.match(req, { ignoreSearch: true })
    .then(hit => hit || (req.mode === 'navigate' ? caches.match('./children/') : undefined))));
});
