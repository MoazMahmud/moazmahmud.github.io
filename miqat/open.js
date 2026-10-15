// Opens a shared dua or list in the Miqat app. The page's <body data-kind>
// says which; the ids come from the link (see src/features/share/links.ts).
// On Android with App Links verified, the app opens before this page loads.
(function () {
  var kind = document.body.getAttribute('data-kind');
  var params = new URLSearchParams(location.search);
  var safe = /^[\w-]+$/;

  var route;
  var count = 0;
  if (kind === 'dua') {
    var id = params.get('id') || '';
    route = safe.test(id) ? 'dua/' + id : 'duas';
  } else {
    var ids = (params.get('ids') || '').split(/[.,]/).filter(function (x) {
      return safe.test(x);
    });
    count = ids.length;
    route = 'shared-list?ids=' + ids.join('.');
  }

  var bnDigits = '০১২৩৪৫৬৭৮৯';
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var n = String(count);
    el.textContent =
      el.getAttribute('data-count') === 'bn'
        ? n.replace(/\d/g, function (d) { return bnDigits[d]; })
        : n;
  });

  // Android: an intent link names the package, and comes back here with
  // #no-app when Miqat isn't installed. Elsewhere, the app's own scheme.
  var android = /Android/i.test(navigator.userAgent);
  var page = location.href.split('#')[0];
  var href = android
    ? 'intent://' + route + '#Intent;scheme=miqat;package=com.moazmahmud.miqat;S.browser_fallback_url=' +
      encodeURIComponent(page + '#no-app') + ';end'
    : 'miqat://' + route;
  document.getElementById('open').setAttribute('href', href);

  function showNoApp() {
    document.body.classList.toggle('no-app', location.hash === '#no-app');
  }
  window.addEventListener('hashchange', showNoApp);
  showNoApp();

  // Try once straight away on Android; the button is there if the browser
  // wants a tap first.
  if (android && location.hash !== '#no-app') location.replace(href);
})();
