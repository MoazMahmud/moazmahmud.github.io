// Opens a shared dua, list, surah or ayah in the Miqat app. The page's
// <body data-kind> says which; the ids come from the link (see
// src/features/share/links.ts). Each surah has its own page, quran/<n>.html,
// written by the app repo's scripts/share-pages.mjs.
// On Android with App Links verified, the app opens before this page loads.
// Elsewhere (iPhone, computers) the button opens the web app, miqat/app/,
// at the same screen.
(function () {
  var kind = document.body.getAttribute('data-kind');
  var params = new URLSearchParams(location.search);
  var safe = /^[\w-]+$/;

  var route;
  var count = 0;
  var ayah = 0;
  if (kind === 'dua') {
    var id = params.get('id') || '';
    route = safe.test(id) ? 'dua/' + id : 'duas';
  } else if (kind === 'quran') {
    // The surah's page names it; ?ayah= picks an ayah, else the first.
    var surah = Number(document.body.getAttribute('data-surah'));
    var asked = params.get('ayah') || '';
    if (/^\d{1,3}$/.test(asked) && asked >= 1 && asked <= Number(document.body.getAttribute('data-ayahs'))) {
      ayah = Number(asked);
    }
    route = 'quran/' + surah + '?ayah=' + (ayah || 1);
  } else {
    // A list's items: dua ids, and Qur'an ranges such as q2-255 or q67, with
    // _3 (up to _1000) for repeats (src/features/share/links.ts in the app).
    var ids = (params.get('ids') || '').split(/[.,]/).filter(function (x) {
      return safe.test(x);
    });
    count = ids.length;
    route = 'shared-list?ids=' + ids.join('.');
    var name = (params.get('name') || '').replace(/\s+/g, ' ').trim().slice(0, 60);
    if (name) route += '&name=' + encodeURIComponent(name);
    document.querySelectorAll('[data-name]').forEach(function (el) {
      el.textContent = name;
      el.hidden = !name;
    });
  }

  var bnDigits = '০১২৩৪৫৬৭৮৯';
  function digits(text, lang) {
    return lang === 'bn' ? text.replace(/\d/g, function (d) { return bnDigits[d]; }) : text;
  }
  document.querySelectorAll('[data-count]').forEach(function (el) {
    el.textContent = digits(String(count), el.getAttribute('data-count'));
  });
  // " (ayah {n})" after the surah's name, for a link to one ayah.
  document.querySelectorAll('[data-ref]').forEach(function (el) {
    el.textContent = ayah
      ? el.getAttribute('data-text').replace('{n}', digits(String(ayah), el.getAttribute('data-ref')))
      : '';
  });

  // Android: an intent link names the package, and comes back here with
  // #no-app when Miqat isn't installed. Elsewhere, the web app.
  var android = /Android/i.test(navigator.userAgent);
  var page = location.href.split('#')[0];
  var href = android
    ? 'intent://' + route + '#Intent;scheme=miqat;package=com.moazmahmud.miqat;S.browser_fallback_url=' +
      encodeURIComponent(page + '#no-app') + ';end'
    : '/miqat/app/' + route;
  document.getElementById('open').setAttribute('href', href);
  // The web app link, where a page has one, opens the same screen.
  var web = document.getElementById('web');
  if (web) web.setAttribute('href', '/miqat/app/' + route);

  function showNoApp() {
    document.body.classList.toggle('no-app', location.hash === '#no-app');
  }
  window.addEventListener('hashchange', showNoApp);
  showNoApp();

  // Try once straight away on Android; the button is there if the browser
  // wants a tap first.
  if (android && location.hash !== '#no-app') location.replace(href);
})();
