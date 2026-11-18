/* Elastyc.net layout adapter. Authentication is provided by the shared FrontAuth client. */
(function (global) {
  'use strict';

  var query = new URLSearchParams(global.location.search);
  var host = global.document.querySelector('.wf-login-layout [data-elastyc-front-auth-auto]');
  var isLoginPage = global.location.pathname === '/prijava' || (global.location.pathname === '/page.php'
    && query.get('channel') === 'candidate' && query.get('wf_path') === '/prijava');
  if (global.parent !== global || !isLoginPage || !host || host.hasAttribute('data-efa-preview')) return;

  var layout = host.closest('.wf-login-layout');
  var layoutHeading = layout.getAttribute('aria-labelledby');
  var english = query.get('portal_locale') === 'en'
    || global.document.documentElement.lang.toLowerCase().startsWith('en');
  if (english) {
    layout.lang = 'en';
    layout.querySelector('#wf-login-title').textContent = 'Sign in to Elastyc';
    layout.querySelector('.wf-login-layout__brand p').textContent = 'Business processes, communication, and AI.';
    var title = host.closest('.wf-front-auth')?.querySelector('.wf-front-auth__title');
    if (title) title.textContent = 'Your Elastyc account';
    global.document.title = 'Sign in | Elastyc';
  }

  host.removeAttribute('data-elastyc-front-auth-auto');
  var viewObserver = new MutationObserver(function () {
    var account = host.getAttribute('data-efa-view') === 'account';
    var heading = host.querySelector('.efa-account-name');
    layout.classList.toggle('wf-login-layout--account', account);
    layout.setAttribute('aria-labelledby', account && heading ? heading.id : layoutHeading);
  });
  viewObserver.observe(host, { attributes: true, attributeFilter: ['data-efa-view'] });

  function mount() {
    function currentClient() {
      var client = global.ElastycFrontAuth;
      return client && typeof client.version === 'number' && client.version >= 12;
    }
    function ready() {
      if (!currentClient()) {
        host.textContent = english ? 'Sign-in is currently unavailable.' : 'Prijava trenutno nije dostupna.';
        return;
      }
      global.ElastycFrontAuth.init({ host: host, title: !host.hasAttribute('data-efa-own-title') });
    }
    var styleUrl = '/common/Elastyc/FrontAuth/front-auth.css?v=5';
    if (!global.document.querySelector('link[href="' + styleUrl + '"]')) {
      var style = global.document.createElement('link');
      style.rel = 'stylesheet';
      style.href = styleUrl;
      global.document.head.appendChild(style);
    }
    if (currentClient()) {
      ready();
      return;
    }
    var script = global.document.createElement('script');
    script.src = '/common/Elastyc/FrontAuth/front-auth.js?v=12';
    script.onload = ready;
    script.onerror = function () {
      host.textContent = english ? 'Sign-in is currently unavailable.' : 'Prijava trenutno nije dostupna.';
    };
    global.document.head.appendChild(script);
  }
  if (global.document.readyState === 'loading') global.document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
})(window);
