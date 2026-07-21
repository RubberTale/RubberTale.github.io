(function () {
  function reportVisitContext() {
    var standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    fetch('/api/visit-context', {
      method: 'POST',
      credentials: 'same-origin',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ display_mode: standalone ? 'standalone' : 'browser' })
    }).catch(function () {});
  }

  if (document.readyState === 'complete') {
    window.setTimeout(reportVisitContext, 0);
  } else {
    window.addEventListener('load', reportVisitContext, { once: true });
  }
})();
