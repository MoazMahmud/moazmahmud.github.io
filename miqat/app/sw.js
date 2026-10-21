const VERSION = '7ec8d561ebc2';
const BASE = '/miqat/app/';
const FILES = [
  "assets/node_modules/@expo-google-fonts/noto-naskh-arabic/400Regular/NotoNaskhArabic_400Regular.b9adf6a0dd7ea110e62d9f1a057fc635.ttf",
  "assets/node_modules/@expo-google-fonts/noto-serif-bengali/400Regular/NotoSerifBengali_400Regular.1dafe670f5721f4b8ccb3cc21edc6f72.ttf",
  "assets/node_modules/@expo-google-fonts/noto-serif-bengali/500Medium/NotoSerifBengali_500Medium.7381c3896e5b214fe24f0583c3506f7d.ttf",
  "assets/node_modules/@expo-google-fonts/noto-serif-bengali/600SemiBold/NotoSerifBengali_600SemiBold.cad3d1cad46894880374b240db84ccc7.ttf",
  "assets/node_modules/@expo-google-fonts/noto-serif-bengali/700Bold/NotoSerifBengali_700Bold.41c84f995b82c1265c0f2ed5996c2949.ttf",
  "assets/node_modules/@expo-google-fonts/scheherazade-new/400Regular/ScheherazadeNew_400Regular.ff9314a3c6786c7df527c1c4df54a650.ttf",
  "assets/node_modules/@expo-google-fonts/tiro-bangla/400Regular/TiroBangla_400Regular.1481786f284552227dfa4f2401488d8d.ttf",
  "assets/node_modules/expo-router/assets/arrow_down.017bc6ba3fc25503e5eb5e53826d48a8.png",
  "assets/node_modules/expo-router/assets/error.d1ea1496f9057eb392d5bbf3732a61b7.png",
  "assets/node_modules/expo-router/assets/file.19eeb73b9593a38f8e9f418337fc7d10.png",
  "assets/node_modules/expo-router/assets/forward.d8b800c443b8972542883e0b9de2bdc6.png",
  "assets/node_modules/expo-router/assets/pkg.ab19f4cbc543357183a20571f68380a3.png",
  "assets/node_modules/expo-router/assets/react-navigation/elements/back-icon-mask.0a328cd9c1afd0afe8e3b1ec5165b1b4.png",
  "assets/node_modules/expo-router/assets/react-navigation/elements/back-icon.35ba0eaec5a4f5ed12ca16fabeae451d.png",
  "assets/node_modules/expo-router/assets/react-navigation/elements/clear-icon.c94f6478e7ae0cdd9f15de1fcb9e5e55.png",
  "assets/node_modules/expo-router/assets/react-navigation/elements/clear-icon.c94f6478e7ae0cdd9f15de1fcb9e5e55@2x.png",
  "assets/node_modules/expo-router/assets/react-navigation/elements/clear-icon.c94f6478e7ae0cdd9f15de1fcb9e5e55@3x.png",
  "assets/node_modules/expo-router/assets/react-navigation/elements/clear-icon.c94f6478e7ae0cdd9f15de1fcb9e5e55@4x.png",
  "assets/node_modules/expo-router/assets/react-navigation/elements/close-icon.808e1b1b9b53114ec2838071a7e6daa7.png",
  "assets/node_modules/expo-router/assets/react-navigation/elements/close-icon.808e1b1b9b53114ec2838071a7e6daa7@2x.png",
  "assets/node_modules/expo-router/assets/react-navigation/elements/close-icon.808e1b1b9b53114ec2838071a7e6daa7@3x.png",
  "assets/node_modules/expo-router/assets/react-navigation/elements/close-icon.808e1b1b9b53114ec2838071a7e6daa7@4x.png",
  "assets/node_modules/expo-router/assets/react-navigation/elements/search-icon.286d67d3f74808a60a78d3ebf1a5fb57.png",
  "assets/node_modules/expo-router/assets/sitemap.412dd9275b6b48ad28f5e3d81bb1f626.png",
  "assets/node_modules/expo-router/assets/unmatched.20e71bdf79e3a97bf55fd9e164041578.png",
  "icons/apple-touch-icon.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/maskable-512.png",
  "index.html",
  "manifest.webmanifest",
  "metadata.json",
  "_expo/static/js/web/entry-9e3eba1095c6ef9e290fca3956a427b2.js"
];

/* global VERSION, BASE, FILES -- written above this file by scripts/build-web.mjs */
/*
 * The web app's service worker: keeps every file of the app on the phone,
 * so it opens and runs with no signal, as the Android app does.
 *
 * Installing saves this version's files; a new version (any file changed)
 * downloads in the background while the old one runs, and takes over the
 * next time the app opens. Requests to other sites, such as dua audio from
 * static.gtaf.org and the Hijri check, go to the network as usual.
 */
const CACHE = `miqat-${VERSION}`;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(FILES.map((file) => BASE + file)))
      .then(() => self.skipWaiting()),
  );
});

// Drop older versions' files once this one has them all.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key.startsWith('miqat-') && key !== CACHE).map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(BASE)) return;

  // Every address in the app is the same page; the router picks the screen.
  const wanted = request.mode === 'navigate' ? BASE + 'index.html' : request;
  event.respondWith(
    caches
      .open(CACHE)
      .then((cache) => cache.match(wanted, { ignoreSearch: true }))
      .then((saved) => saved || fetch(request)),
  );
});
