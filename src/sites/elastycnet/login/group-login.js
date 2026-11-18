/*
 * Front login. Webfront i samostalna strana zovu isti poziv:
 *   ElastycFrontAuth.init({ host: '#login' });
 * Kredencijali Google/Microsoft ostaju na serveru (Integracije).
 * Ovaj fajl samo crta formu i vodi na /incKomponente/auth/.
 */
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

  function translate(serbian, englishCopy) {
    return english ? englishCopy : serbian;
  }

  if (english) {
    layout.lang = 'en';
    layout.querySelector('#wf-login-title').textContent = 'Sign in to Elastyc';
    layout.querySelector('.wf-login-layout__brand p').textContent = 'Business processes, communication, and AI.';
    var title = host.closest('.wf-front-auth')?.querySelector('.wf-front-auth__title');
    if (title) title.textContent = 'Your Elastyc account';
    global.document.title = 'Sign in | Elastyc';
  }

  var PROVIDERS = {
    google: { signIn: translate('Prijava preko Google-a', 'Sign in with Google'), link: translate('Poveži Google', 'Link Google'), asset: 'google.png' },
    microsoft: { signIn: translate('Prijava preko Microsoft-a', 'Sign in with Microsoft'), link: translate('Poveži Microsoft', 'Link Microsoft'), asset: 'microsoft.png' }
  };

  var ERRORS = {
    denied: translate('Prijava je otkazana.', 'Sign-in was canceled.'),
    state: translate('Prijava je istekla. Pokušajte ponovo.', 'Sign-in has expired. Try again.'),
    unavailable: translate('Prijava trenutno nije dostupna.', 'Sign-in is currently unavailable.'),
    linked: translate('Ovaj nalog je već povezan sa drugim korisnikom.', 'This account is already linked to another user.'),
    credentials: translate('Korisničko ime ili lozinka nisu tačni.', 'Incorrect username or password.'),
    unlinked: translate('Prijavite se na postojeći Elastyc nalog i povežite ovaj način prijave u odeljku Moj nalog.', 'Sign in to your existing Elastyc account, then link this sign-in method in your account.'),
    organization: translate('Ova organizacija nije na listi dozvoljenih za prijavu.', 'This organization is not allowed to sign in.'),
    reauthenticate: translate('Odjavite se, prijavite se ponovo i zatim povežite nalog.', 'Sign out, sign in again, and then link your account.'),
    'unlink-reauthenticate': translate('Radi zaštite naloga, ponovo potvrdite identitet. Posle prijave vratićemo vas na odvezivanje izabranog naloga.', 'To protect your account, confirm your identity again. After signing in, you will return to unlink the selected account.'),
    'unlink-account-changed': translate('Prijavljeni ste na drugi Elastyc nalog. Za nastavak odvezivanja prijavite se na prvobitni nalog.', 'You signed in to a different Elastyc account. Sign in to the original account to continue unlinking.'),
    'unlink-resume-unavailable': translate('Pregledač nije uspeo da sačuva nastavak odvezivanja. Odjavite se, ponovo se prijavite i otvorite Povezane naloge.', 'Your browser could not save the unlinking step. Sign out, sign in again, and open Linked accounts.'),
    'last-sign-in-method': translate('Najpre povežite drugi dostupan način prijave ili podesite lozinku ako je prijava lozinkom dozvoljena.', 'First connect another available sign-in method or set a password if password sign-in is allowed.'),
    'rate-limit': translate('Previše pokušaja. Pokušajte ponovo kasnije.', 'Too many attempts. Try again later.'),
    'password-disabled': translate('Prijava lozinkom je isključena.', 'Password sign-in is disabled.'),
    'signed-in': translate('Već ste prijavljeni. Načinom prijave upravljate u odeljku Moj nalog.', 'You are already signed in. Manage your sign-in methods in your account.'),
    'reset-invalid': translate('Link je istekao ili je iskorišćen. Zatražite novi link.', 'This link has expired or has already been used. Request a new one.'),
    'password-format': translate('Lozinka mora imati od 12 do 128 znakova, bez razmaka na početku ili kraju.', 'Use 12 to 128 characters, with no spaces at the start or end.'),
    'password-match': translate('Lozinke se ne podudaraju.', 'The passwords do not match.'),
    'recovery-link': translate('Povezivanje nije uspelo. Zatražite novi link ili upotrebite drugi način prijave.', 'Could not link your account. Request a new link or use another sign-in method.'),
    'continue-login': translate('Nastavak prijave trenutno nije dostupan. Pokušajte ponovo.', 'Could not continue signing in. Try again.')
  };

  var mounts = typeof WeakMap === 'function' ? new WeakMap() : null;
  var mountList = [];
  var authQuery = null;
  var resetIntent = null;
  var sequence = 0;
  var assetBase = '/common/Elastyc/FrontAuth/';
  var unlinkIntentKey = 'elastyc.frontAuth.unlinkReauthentication';

  function unlinkIntent() {
    try {
      var intent = JSON.parse(global.sessionStorage.getItem(unlinkIntentKey));
      if (intent && typeof intent.userId === 'string' && intent.userId
        && Object.prototype.hasOwnProperty.call(PROVIDERS, intent.provider)
        && typeof intent.expiresAt === 'number' && intent.expiresAt > Date.now()
        && intent.expiresAt <= Date.now() + 30 * 60 * 1000) return intent;
      global.sessionStorage.removeItem(unlinkIntentKey);
    } catch (error) {}
    return null;
  }

  function clearUnlinkIntent() {
    try { global.sessionStorage.removeItem(unlinkIntentKey); } catch (error) {}
  }

  function text(value) {
    return value == null ? '' : String(value);
  }

  function errorText(code) {
    var key = text(code);
    return ERRORS[key] || ERRORS.unavailable;
  }

  function endpoints(options) {
    var base = text(options && options.apiBase).replace(/\/$/, '');
    if (base) {
      var url = new URL(base, global.location.href);
      if (url.origin !== global.location.origin) throw new Error('FrontAuth API mora biti na istom domenu.');
      base = url.pathname.replace(/\/$/, '');
    }
    return {
      config: base + '/incKomponente/auth/config.php',
      profile: base + '/incKomponente/auth/profile.php',
      login: base + '/incKomponente/auth/login.php',
      proceed: base + '/incKomponente/auth/continue.php',
      start: base + '/incKomponente/auth/start.php',
      finish: base + '/incKomponente/auth/finish.php',
      unlink: base + '/incKomponente/auth/unlink.php',
      recoveryRequest: base + '/incKomponente/auth/recovery-request.php',
      recoveryConfirm: base + '/incKomponente/auth/recovery-confirm.php',
      resetRequest: base + '/incKomponente/auth/reset-request.php',
      resetConfirm: base + '/incKomponente/auth/reset-confirm.php',
      logout: base + '/incKomponente/auth/logout.php'
    };
  }

  function resolveHost(host) {
    if (!host) throw new Error('ElastycFrontAuth.init: host je obavezan');
    if (typeof host === 'string') {
      var found = global.document && global.document.querySelector(host);
      if (!found) throw new Error('ElastycFrontAuth.init: host nije nađen');
      return found;
    }
    if (host.nodeType === 1) return host;
    throw new Error('ElastycFrontAuth.init: host nije element');
  }

  function safeReturn(value) {
    var loc = global.location;
    var fallback = '/';
    if (loc) {
      var current = new URL(loc.href);
      current.searchParams.delete('elastyc_auth');
      current.searchParams.delete('elastyc_auth_error');
      fallback = current.pathname + current.search;
    }
    if (!value || !loc || !/^\/(?![\/\\])/.test(value)) return fallback;
    try {
      var url = new URL(text(value), loc.origin);
      if (url.origin !== loc.origin) return fallback;
      url.searchParams.delete('elastyc_auth');
      url.searchParams.delete('elastyc_auth_error');
      return url.pathname + url.search;
    } catch (e) {
      return fallback;
    }
  }

  function consumeAuthQuery() {
    if (authQuery) return authQuery;
    authQuery = { status: '', code: '' };
    if (!global.location) return authQuery;
    var url = new URL(global.location.href);
    authQuery.status = url.searchParams.get('elastyc_auth') || '';
    authQuery.code = url.searchParams.get('elastyc_auth_error') || '';
    if (authQuery.status || authQuery.code) {
      url.searchParams.delete('elastyc_auth');
      url.searchParams.delete('elastyc_auth_error');
      if (global.history && global.history.replaceState) {
        global.history.replaceState(null, '', url.pathname + url.search + url.hash);
      }
    }
    return authQuery;
  }

  function fetchJson(url, mount, body) {
    var headers = { Accept: 'application/json' };
    var opts = {
      method: body ? 'POST' : 'GET',
      credentials: 'same-origin',
      headers: headers
    };
    if (mount && mount.controller) opts.signal = mount.controller.signal;
    if (body) {
      headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(body);
    }
    return global.fetch(url, opts).then(function (res) {
      return res.json().catch(function () {
        return {};
      }).then(function (data) {
        data = data && typeof data === 'object' ? data : {};
        if (!res.ok) data.ok = false;
        if (!data.error && !res.ok) data.error = 'unavailable';
        return data;
      });
    }).catch(function (err) {
      if (err && err.name === 'AbortError') throw err;
      return { ok: false, error: 'unavailable' };
    });
  }

  function el(tag, attrs, children) {
    var node = global.document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        if (attrs[key] == null || attrs[key] === false) return;
        if (key === 'className') node.className = attrs[key];
        else if (key === 'text') node.textContent = attrs[key];
        else node.setAttribute(key, attrs[key] === true ? '' : attrs[key]);
      });
    }
    (children || []).forEach(function (child) {
      if (child) node.appendChild(child);
    });
    return node;
  }

  function field(id, label, input) {
    var caption = el('span', { text: label });
    input.id = id;
    return el('label', { className: 'efa-field' }, [caption, input]);
  }

  function inputEl(type, name, autocomplete) {
    return el('input', {
      type: type,
      name: name,
      autocomplete: autocomplete,
      required: true
    });
  }

  function clear(mount) {
    var root = mount.root;
    while (root.firstChild) root.removeChild(root.firstChild);
    layout.classList.remove('wf-login-layout--account');
    layout.setAttribute('aria-labelledby', layoutHeading);
  }

  function showError(mount, code, provider) {
    if (!code) return;
    var box = mount.root.querySelector('.efa-error');
    if (!box) return;
    box.hidden = false;
    box.textContent = errorText(code);
    if (code === 'unlink-reauthenticate') {
      box.prepend(el('strong', { text: translate('Potrebna je ponovna prijava', 'Sign in again to continue') }));
      if (mount.config && mount.config.user && Object.prototype.hasOwnProperty.call(PROVIDERS, provider)) {
        var retry = el('button', {
          className: 'efa-primary efa-reauthenticate', type: 'button',
          text: translate('Prijavi se ponovo', 'Sign in again')
        });
        retry.addEventListener('click', function () { reauthenticateForUnlink(mount, provider); });
        box.appendChild(retry);
        retry.focus();
      }
    }
  }

  function setBusy(mount, busy) {
    mount.host.setAttribute('aria-busy', busy ? 'true' : 'false');
    var controls = mount.root.querySelectorAll('button, input');
    for (var i = 0; i < controls.length; i++) controls[i].disabled = !!busy;
  }

  function providerList(data) {
    var raw = data && data.providers;
    var out = [];
    if (!raw || !raw.length) return out;
    raw.forEach(function (item) {
      var id = typeof item === 'string' ? item : item && item.id;
      if (!Object.prototype.hasOwnProperty.call(PROVIDERS, id)) return;
      if (out.indexOf(id) !== -1) return;
      out.push(id);
    });
    return out;
  }

  function providerButton(mount, id, intent, token) {
    var provider = PROVIDERS[id];
    var preparing = false;
    var button = el('button', {
      className: 'efa-provider efa-brand efa-brand-' + id,
      type: 'button'
    }, [
      el('img', { src: assetBase + provider.asset, alt: '', width: 18, height: 18 }),
      el('span', { text: intent === 'login' ? provider.signIn : provider.link })
    ]);
    function start(automatic) {
      if (preparing || !button.isConnected) return;
      var controller = mount.controller;
      preparing = true;
      setBusy(mount, true);
      fetchJson(mount.ep.start, mount, { provider: id, intent: intent, return: mount.returnUrl, recovery: token || '' }).then(function (res) {
        preparing = false;
        if (mount.controller !== controller) return;
        setBusy(mount, false);
        if (!button.isConnected || controller.signal.aborted) return;
        if (automatic && !res.ok) return;
        if (id === 'google' && res.ok && res.googleClientId && /^[a-f0-9]{64}$/.test(res.nonce)) {
          renderGoogleButton(mount, button, res, intent);
          return;
        }
        var url;
        try { url = new URL(res.next); } catch (error) {}
        if (res.ok && url && url.protocol === 'https:' && !url.username && !url.password
          && url.pathname === '/incKomponente/auth/authorize.php'
          && /^[?]handle=[a-f0-9]{64}$/.test(url.search) && !url.hash) {
          global.location.assign(url.href);
        } else {
          showError(mount, res.error || 'unavailable');
        }
      }).catch(function (error) {
        if (error.name !== 'AbortError') throw error;
      });
    }
    button.addEventListener('click', function () { start(false); });
    if (id === 'google' && (intent === 'login' || intent === 'link') && mount.config && mount.config.googleClientId
      && !mount.options.preview) {
      global.queueMicrotask(function () {
        if (!button.isConnected) return;
        if (intent === 'login') {
          start(false);
          return;
        }
        var connections = button.closest('.efa-connections');
        if (!connections) return;
        connections.addEventListener('toggle', function () { if (connections.open) start(true); });
        if (connections.open) start(true);
      });
    }
    return button;
  }

  function renderGoogleButton(mount, button, challenge, intent) {
    var controller = mount.controller;
    var slot = el('div', { className: 'efa-google-slot' });
    button.replaceWith(slot);
    var script = global.document.getElementById('elastyc-google-identity');
    function render() {
      if (!slot.isConnected || controller.signal.aborted) return;
      var google = global.google && global.google.accounts && global.google.accounts.id;
      if (!google) {
        slot.replaceWith(button);
        showError(mount, 'unavailable');
        return;
      }
      google.initialize({
        client_id: challenge.googleClientId,
        nonce: challenge.nonce,
        callback: function (result) {
          if (!slot.isConnected || controller.signal.aborted || !result.credential) return;
          slot.replaceWith(button);
          setBusy(mount, true);
          fetchJson(mount.ep.finish, mount, { request: challenge.nonce, credential: result.credential }).then(function (res) {
            setBusy(mount, false);
            var url;
            try { url = new URL(res.next, global.location.origin); } catch (error) {}
            if (res.ok && url && url.origin === global.location.origin) global.location.assign(url.href);
            else showError(mount, res.error || 'unavailable');
          });
        }
      });
      var lastWidth;
      function renderAtCurrentWidth() {
        var width = Math.min(slot.clientWidth, 400);
        if (!width || width === lastWidth) return;
        lastWidth = width;
        slot.replaceChildren();
        google.renderButton(slot, {
          type: 'standard', theme: 'outline', size: 'large', shape: 'rectangular', logo_alignment: 'left',
          width: String(width), text: intent === 'login' ? 'signin_with' : 'continue_with', locale: english ? 'en' : 'sr'
        });
      }
      renderAtCurrentWidth();
      if (typeof ResizeObserver === 'function') {
        var observer = new ResizeObserver(function () {
          if (slot.isConnected) renderAtCurrentWidth();
          else disconnect();
        });
        function disconnect() {
          observer.disconnect();
          controller.signal.removeEventListener('abort', disconnect);
        }
        controller.signal.addEventListener('abort', disconnect, { once: true });
        observer.observe(slot);
      }
    }
    if (global.google && global.google.accounts && global.google.accounts.id) {
      render();
      return;
    }
    var newScript = !script;
    if (newScript) {
      script = el('script', { id: 'elastyc-google-identity', src: 'https://accounts.google.com/gsi/client', async: true });
      script.addEventListener('error', function () { script.remove(); }, { once: true });
    }
    script.addEventListener('load', render, { once: true });
    script.addEventListener('error', render, { once: true });
    if (newScript) global.document.head.appendChild(script);
  }

  function heading(mount, title, notice) {
    if (title) mount.root.appendChild(el('h2', { className: 'efa-title', text: title }));
    if (notice) mount.root.appendChild(el('p', { className: 'efa-lead', role: 'status', text: notice }));
    var error = el('p', { className: 'efa-error', role: 'alert' });
    error.hidden = true;
    mount.root.appendChild(error);
  }

  function linkButton(label, action) {
    var button = el('button', { className: 'efa-link', type: 'button', text: label });
    button.addEventListener('click', action);
    return button;
  }

  function paintLogin(mount, data, notice, status) {
    clear(mount);
    var idBase = mount.idBase;
    var intent = unlinkIntent();
    if (intent && !status) status = translate('Prijavite se na isti Elastyc nalog da biste nastavili odvezivanje.', 'Sign in to the same Elastyc account to continue unlinking.');
    heading(mount, mount.options.title === false ? '' : translate('Prijava', 'Sign in'), status);
    var form = el('form', { className: 'efa-form', novalidate: true });
    var username = inputEl('text', 'username', 'username');
    var password = inputEl('password', 'password', 'current-password');
    password.maxLength = 256;
    username.maxLength = 100;
    form.appendChild(field(idBase + '-user', translate('Korisničko ime', 'Username'), username));
    form.appendChild(field(idBase + '-pass', translate('Lozinka', 'Password'), password));
    form.appendChild(el('button', { className: 'efa-primary', type: 'submit', text: translate('Prijavi se', 'Sign in') }));
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (mount.options.preview || !username.value || !password.value) {
        showError(mount, 'credentials');
        return;
      }
      setBusy(mount, true);
      fetchJson(mount.ep.login, mount, {
        username: username.value,
        password: password.value
      }).then(function (res) {
        setBusy(mount, false);
        if (res.ok && res.user) finish(mount, res.user, true);
        else showError(mount, res.error || 'credentials');
      });
    });

    if (data.password !== false) {
      mount.root.appendChild(form);
      if (data.reset) mount.root.appendChild(linkButton(translate('Zaboravili ste lozinku?', 'Forgot your password?'), function () {
        paintReset(mount, data, '');
      }));
    }

    var providers = providerList(data);
    if (providers.length && data.password !== false) {
      mount.root.appendChild(el('p', { className: 'efa-or', text: translate('ili', 'or') }));
    }
    providers.forEach(function (id) { mount.root.appendChild(providerButton(mount, id, 'login')); });

    if (data.linkRecovery) {
      mount.root.appendChild(linkButton(translate('Oporavite pristup preko mejla', 'Recover access by email'), function () {
        paintRecoveryRequest(mount, data);
      }));
    }
    if (!providers.length && data.password === false) showError(mount, 'unavailable');
    if (notice) showError(mount, notice);
    if (intent) mount.root.appendChild(linkButton(translate('Odustani od odvezivanja', 'Cancel unlinking'), function () {
      clearUnlinkIntent();
      paintLogin(mount, data, '');
    }));
    if (mount.options.preview) {
      setBusy(mount, true);
      mount.host.removeAttribute('aria-busy');
    }
  }

  function paintRecoveryRequest(mount, data) {
    clear(mount);
    heading(mount, translate('Oporavak pristupa', 'Recover access'), translate('Pošaljite link na ranije potvrđenu adresu svog Elastyc naloga.', 'Send a link to the verified email address on your Elastyc account.'));
    var email = inputEl('email', 'email', 'email');
    email.maxLength = 100;
    var form = el('form', { className: 'efa-form' }, [
      field(mount.idBase + '-link-email', translate('Potvrđena email adresa', 'Verified email address'), email),
      el('button', { className: 'efa-primary', type: 'submit', text: translate('Pošalji link', 'Send link') })
    ]);
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      setBusy(mount, true);
      fetchJson(mount.ep.recoveryRequest, mount, { email: email.value }).then(function (res) {
        setBusy(mount, false);
        if (res.ok) paintLogin(mount, data, '', translate('Ako postoji nalog sa potvrđenom adresom, dobićete link za oporavak pristupa.', 'If an account exists with that verified address, we will email a recovery link.'));
        else showError(mount, res.error);
      });
    });
    mount.root.appendChild(form);
    mount.root.appendChild(linkButton(translate('Nazad na prijavu', 'Back to sign in'), function () { paintLogin(mount, data, ''); }));
  }

  function paintRecoveryLink(mount, data, recovery) {
    clear(mount);
    if (recovery.mode === 'link') {
      heading(mount, translate('Povežite način prijave', 'Link a sign-in method'), translate('Izaberite nalog koji želite da koristite za buduće prijave.', 'Choose the account you want to use to sign in.'));
      providerList(data).forEach(function (id) {
        mount.root.appendChild(providerButton(mount, id, 'recover', recovery.token));
      });
    } else {
      var id = recovery.provider;
      var provider = PROVIDERS[id];
      heading(mount, translate('Potvrdite povezivanje', 'Confirm account linking'), translate('Povežite nalog koji ste upravo potvrdili kod provajdera sa postojećim Elastyc nalogom.', 'Link the account you just verified with your existing Elastyc account.'));
      var confirm = el('button', { className: 'efa-primary', type: 'button', text: provider.link });
      confirm.addEventListener('click', function () {
        setBusy(mount, true);
        fetchJson(mount.ep.recoveryConfirm, mount, { token: recovery.token }).then(function (res) {
          setBusy(mount, false);
          if (res.ok && res.user) {
            resetIntent = null;
            finish(mount, res.user, true);
          } else showError(mount, res.error);
        });
      });
      mount.root.appendChild(confirm);
    }
    mount.root.appendChild(linkButton(translate('Nazad na prijavu', 'Back to sign in'), function () {
      resetIntent = null;
      paintLogin(mount, data, '');
    }));
  }

  function paintReset(mount, data, token) {
    clear(mount);
    heading(mount, token ? translate('Postavite novu lozinku', 'Set a new password') : translate('Zaboravili ste lozinku?', 'Forgot your password?'));
    var form = el('form', { className: 'efa-form' });
    var first = token ? inputEl('password', 'password', 'new-password') : inputEl('email', 'email', 'email');
    form.appendChild(field(mount.idBase + '-recovery', token ? translate('Nova lozinka', 'New password') : translate('Potvrđena email adresa', 'Verified email address'), first));
    var confirmation = null;
    first.maxLength = token ? 128 : 100;
    if (token) {
      first.minLength = 12;
      confirmation = inputEl('password', 'confirmation', 'new-password');
      confirmation.maxLength = 128;
      form.appendChild(field(mount.idBase + '-confirmation', translate('Ponovite novu lozinku', 'Repeat new password'), confirmation));
    }
    form.appendChild(el('button', {
      className: 'efa-primary', type: 'submit', text: token ? translate('Sačuvaj lozinku', 'Save password') : translate('Pošalji link', 'Send link')
    }));
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (token && first.value !== confirmation.value) {
        showError(mount, 'password-match');
        return;
      }
      setBusy(mount, true);
      var request = token ? { token: token, password: first.value } : { email: first.value };
      fetchJson(token ? mount.ep.resetConfirm : mount.ep.resetRequest, mount, request).then(function (res) {
        setBusy(mount, false);
        if (!res.ok) {
          showError(mount, res.error);
          return;
        }
        resetIntent = null;
        var status = token ? translate('Lozinka je promenjena. Prijavite se novom lozinkom.', 'Your password has changed. Sign in with your new password.')
          : translate('Ako postoji nalog sa potvrđenom adresom, dobićete link za postavljanje nove lozinke.', 'If an account exists with that verified address, we will email a password reset link.');
        paintLogin(mount, data, '', status);
      });
    });
    mount.root.appendChild(form);
    mount.root.appendChild(linkButton(translate('Nazad na prijavu', 'Back to sign in'), function () {
      resetIntent = null;
      if (data.user) paintSession(mount, data.user, {});
      else paintLogin(mount, data, '');
    }));
  }

  function setAccountName(title, avatar, name) {
    title.textContent = name || translate('Moj nalog', 'My account');
    var words = name.split(/\s+/).filter(Boolean);
    var initials = words.length > 1 ? [words[0], words[words.length - 1]] : words;
    avatar.textContent = initials.map(function (word) { return Array.from(word)[0]; }).join('').toUpperCase();
    avatar.hidden = !avatar.textContent;
  }

  function loadAccountProfile(mount, title, avatar, company, message) {
    var controller = mount.controller;
    fetchJson(mount.ep.profile, mount, {}).then(function (data) {
      if (mount.controller !== controller || !title.isConnected) return;
      if (!data.ok || !data.profile) {
        message.hidden = false;
        return;
      }
      var name = text(data.profile.displayName).trim() || text(data.profile.username).trim();
      if (name) setAccountName(title, avatar, name);
      var companyName = text(data.profile.company).trim();
      if (companyName && companyName.replace(/\s+/g, ' ').toLowerCase() !== 'anonimni kupac') {
        company.textContent = companyName;
        company.hidden = false;
      }
    }).catch(function (error) {
      if (error.name !== 'AbortError') throw error;
    });
  }

  function unlinkProvider(mount, connections, id, name) {
    if (!global.confirm(translate('Odveži ' + name + ' od Elastyc naloga?', 'Unlink ' + name + ' from your Elastyc account?'))) return;
    mount.root.querySelector('.efa-error').hidden = true;
    var controller = mount.controller;
    setBusy(mount, true);
    fetchJson(mount.ep.unlink, mount, { provider: id }).then(function (data) {
      if (mount.controller !== controller || !connections.isConnected) return;
      setBusy(mount, false);
      if (!data.ok || !Array.isArray(data.linkedProviders)) {
        showError(mount, data.error === 'reauthenticate' ? 'unlink-reauthenticate' : data.error || 'unavailable', id);
        return;
      }
      mount.config.linkedProviders = data.linkedProviders;
      var resumeNotice = mount.root.querySelector('.efa-unlink-resume');
      if (resumeNotice) resumeNotice.remove();
      var updated = accountConnections(mount);
      if (updated) {
        updated.open = true;
        connections.replaceWith(updated);
        updated.querySelector('summary').focus();
      } else {
        connections.remove();
        mount.root.querySelector('.efa-account-actions button').focus();
      }
    }).catch(function (error) {
      if (error.name !== 'AbortError') throw error;
    });
  }

  function accountConnections(mount) {
    var linked = Array.isArray(mount.config.linkedProviders) ? mount.config.linkedProviders : [];
    var providers = providerList({ providers: providerList(mount.config).concat(linked) });
    if (!providers.length) return null;
    var connections = el('details', { className: 'efa-connections' }, [
      el('summary', { text: translate('Povezani nalozi', 'Linked accounts') })
    ]);
    var list = el('ul', { className: 'efa-connections-list' });
    providers.forEach(function (id) {
      var name = id === 'google' ? 'Google' : 'Microsoft';
      var content;
      if (linked.indexOf(id) !== -1) {
        var actions = el('span', { className: 'efa-connection-actions' }, [
          el('span', { className: 'efa-connection-status', text: translate('Povezan', 'Linked') })
        ]);
        if (mount.config.unlink === true) {
          var unlink = linkButton(translate('Odveži', 'Unlink'), function () { unlinkProvider(mount, connections, id, name); });
          unlink.classList.add('efa-unlink');
          unlink.setAttribute('aria-label', translate('Odveži ' + name, 'Unlink ' + name));
          unlink.setAttribute('data-efa-unlink-provider', id);
          actions.appendChild(unlink);
        }
        content = [el('span', { text: name }), actions];
      } else {
        content = [providerButton(mount, id, 'link')];
      }
      list.appendChild(el('li', {}, content));
    });
    connections.appendChild(list);
    return connections;
  }

  function paintSession(mount, user, query) {
    clear(mount);
    mount.config.user = user;
    layout.classList.add('wf-login-layout--account');
    var title = el('h1', { className: 'efa-account-name', id: mount.idBase + '-account-name' });
    layout.setAttribute('aria-labelledby', title.id);
    var avatar = el('span', { className: 'efa-account-avatar', 'aria-hidden': 'true' });
    var company = el('p', { className: 'efa-account-company', hidden: true });
    setAccountName(title, avatar, text(user.displayName).trim() || text(user.username).trim());
    var identity = el('div', { className: 'efa-account-identity' }, [
      avatar, el('div', { className: 'efa-account-description', 'aria-live': 'polite' }, [title, company])
    ]);
    var message = el('p', {
      className: 'efa-lead', role: 'status', hidden: true,
      text: translate('Podaci naloga trenutno nisu dostupni.', 'Account details are currently unavailable.')
    });
    mount.root.appendChild(identity);
    heading(mount, '', query.status === 'linked' ? translate('Nalog je povezan.', 'Account linked.') : '');
    mount.root.appendChild(message);
    var proceed = el('button', {
      className: 'efa-primary',
      type: 'button',
      text: groupDestination(user) ? translate('Nastavi na početnu stranu', 'Continue to your portal') : user.userType === 'U' ? translate('Nastavi u Elastyc', 'Continue to Elastyc') : translate('Na početnu', 'Go to homepage')
    });
    proceed.addEventListener('click', function () { continueLogin(mount, user); });
    var signOut = linkButton(translate('Odjavi se', 'Sign out'), function () {
      clearUnlinkIntent();
      signOutAccount(mount);
    });
    mount.root.appendChild(el('div', { className: 'efa-account-actions' }, [proceed, signOut]));
    var connections = accountConnections(mount);
    if (connections) mount.root.appendChild(connections);
    loadAccountProfile(mount, title, avatar, company, message);
    if (query.status === 'error') showError(mount, query.code);
  }

  function signOutAccount(mount) {
    var controller = mount.controller;
    setBusy(mount, true);
    fetchJson(mount.ep.logout, mount, {}).then(function (res) {
      if (mount.controller !== controller) return;
      setBusy(mount, false);
      if (res.ok) {
        authQuery = null;
        boot(mount);
      } else {
        clearUnlinkIntent();
        showError(mount, res.error);
      }
    });
  }

  function reauthenticateForUnlink(mount, provider) {
    var intent = { userId: text(mount.config.user.userid), provider: provider, expiresAt: Date.now() + 30 * 60 * 1000 };
    try {
      global.sessionStorage.setItem(unlinkIntentKey, JSON.stringify(intent));
    } catch (error) {
      showError(mount, 'unlink-resume-unavailable');
      return;
    }
    signOutAccount(mount);
  }

  function resumeUnlink(mount, user, intent) {
    clearUnlinkIntent();
    if (intent.userId !== text(user.userid)) {
      showError(mount, 'unlink-account-changed');
      return;
    }
    var connections = mount.root.querySelector('.efa-connections');
    if (!connections) return;
    connections.open = true;
    var unlink = connections.querySelector('[data-efa-unlink-provider="' + intent.provider + '"]');
    var name = intent.provider === 'google' ? 'Google' : 'Microsoft';
    var message = unlink
      ? translate('Nastavite odvezivanje ' + name + ' naloga.', 'Continue unlinking your ' + name + ' account.')
      : translate('Pregledajte Povezane naloge za nastavak.', 'Review Linked accounts to continue.');
    mount.root.insertBefore(el('p', { className: 'efa-lead efa-unlink-resume', role: 'status', text: message }), connections);
    (unlink || connections.querySelector('summary')).focus();
  }

  function groupDestination(user) {
    var resolve = global.elastycLoginDestination;
    return typeof resolve === 'function' ? resolve(user) : null;
  }

  function continueLogin(mount, user) {
    var destination = groupDestination(user);
    if (destination) {
      global.location.assign(destination);
      return;
    }
    setBusy(mount, true);
    fetchJson(mount.ep.proceed, mount, {}).then(function (data) {
      if (data.ok && ['/app.php', '/', '/page.php?wf_action=help-desk'].indexOf(data.next) !== -1) {
        global.location.assign(data.next);
        return;
      }
      setBusy(mount, false);
      showError(mount, 'continue-login');
    });
  }

  function finish(mount, user, navigate) {
    if (typeof mount.options.onSuccess === 'function') {
      mount.options.onSuccess(user);
      return;
    }
    var intent = unlinkIntent();
    if (intent && navigate) {
      authQuery = { status: 'reauthenticated', code: '' };
      boot(mount);
      return;
    }
    paintSession(mount, user, navigate ? {} : consumeAuthQuery());
    if (intent) resumeUnlink(mount, user, intent);
    else if (navigate) continueLogin(mount, user);
  }

  function recovery() {
    if (resetIntent !== null) return resetIntent;
    var hash = global.location.hash;
    var match = /^#(reset|link)=([a-f0-9]{64})$/.exec(hash);
    var confirm = /^#confirm-link=([a-f0-9]{64})&provider=(google|microsoft)$/.exec(hash);
    if (match) resetIntent = { mode: match[1], token: match[2] };
    else if (confirm) resetIntent = { mode: 'confirm', token: confirm[1], provider: confirm[2] };
    else if (hash === '#forgot') resetIntent = { mode: 'reset', token: '' };
    if (resetIntent && global.history && global.history.replaceState) {
      global.history.replaceState(null, '', global.location.pathname + global.location.search);
    }
    return resetIntent;
  }

  function boot(mount) {
    if (mount.controller) mount.controller.abort();
    var controller = new AbortController();
    mount.controller = controller;
    if (mount.options.preview || global.parent !== global) {
      mount.options.preview = true;
      paintLogin(mount, { password: true, reset: true, providers: ['google', 'microsoft'] }, '');
      return;
    }
    var query = consumeAuthQuery();
    var reset = recovery();
    clear(mount);
    mount.root.appendChild(el('p', { className: 'efa-lead', text: translate('Učitavanje…', 'Loading…') }));
    fetchJson(mount.ep.config, mount).then(function (data) {
      if (mount.controller !== controller) return;
      if (!data.ok) {
        clear(mount);
        mount.root.appendChild(el('p', { className: 'efa-error', role: 'alert', text: errorText(data.error) }));
        return;
      }
      mount.config = data;
      if (reset && reset.mode === 'reset' && data.reset) {
        paintReset(mount, data, reset.token);
      } else if (reset && reset.mode !== 'reset' && data.linkRecovery && !data.user) {
        paintRecoveryLink(mount, data, reset);
      } else if (data.user) {
        finish(mount, data.user, query.status === 'signed-in');
      } else {
        var notice = reset ? 'reset-invalid' : query.status === 'error' ? (query.code || 'unavailable') : '';
        paintLogin(mount, data, notice);
      }
    }).catch(function (err) {
      if (mount.controller !== controller || (err && err.name === 'AbortError')) return;
      clear(mount);
      mount.root.appendChild(el('p', { className: 'efa-error', role: 'alert', text: errorText('unavailable') }));
    });
  }

  function destroyMount(mount) {
    if (!mount) return;
    if (mount.controller) mount.controller.abort();
    clear(mount);
    if (mount.root && mount.root.parentNode) mount.root.parentNode.removeChild(mount.root);
    mount.host.removeAttribute('aria-busy');
    mount.host.removeAttribute('data-elastyc-front-auth');
    if (mount.host.classList) mount.host.classList.remove('elastyc-front-auth');
    if (mounts) mounts.delete(mount.host);
    mountList = mountList.filter(function (item) { return item !== mount; });
  }

  function init(options) {
    options = options || {};
    var host = resolveHost(options.host);
    var previous = mounts ? mounts.get(host) : null;
    if (!previous) {
      for (var i = 0; i < mountList.length; i++) {
        if (mountList[i].host === host) previous = mountList[i];
      }
    }
    if (previous) destroyMount(previous);

    var mount = {
      host: host,
      options: options,
      ep: endpoints(options),
      returnUrl: safeReturn(options.returnUrl),
      controller: null,
      idBase: 'efa' + (++sequence),
      root: el('div', { className: 'efa-root' }),
      config: null
    };
    host.classList.add('elastyc-front-auth');
    host.setAttribute('data-elastyc-front-auth', '');
    host.appendChild(mount.root);
    if (mounts) mounts.set(host, mount);
    mountList.push(mount);
    boot(mount);
    return {
      destroy: function () { destroyMount(mount); },
      reload: function () { boot(mount); }
    };
  }

  function session(options) {
    var ep = endpoints(options);
    return fetchJson(ep.config, null).then(function (data) {
      if (data && data.ok === false && !data.user) return null;
      return data && data.user ? data.user : null;
    });
  }

  function logout(options) {
    var ep = endpoints(options);
    return fetchJson(ep.logout, null, {}).then(function (data) {
      return !!(data && data.ok !== false);
    });
  }

  host.removeAttribute('data-elastyc-front-auth-auto');
  global.document.addEventListener('DOMContentLoaded', function () {
    init({ host: host, title: !host.hasAttribute('data-efa-own-title') });
  }, { once: true });
})(typeof window !== 'undefined' ? window : this);
