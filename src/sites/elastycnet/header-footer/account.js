(() => {
  const headers = Array.from(document.querySelectorAll('[data-wf-header]'));
  const accounts = headers.flatMap(header => Array.from(header.querySelectorAll('[data-es-account]')));
  if (accounts.length === 0 || document.querySelector('base[target="_blank"]')) return;

  const query = new URLSearchParams(window.location.search);
  const candidate = window.location.pathname === '/page.php' && query.get('channel') === 'candidate';
  const release = query.get('release') || '';
  const loginPage = window.location.pathname === '/prijava' || (candidate && query.get('wf_path') === '/prijava');
  const english = document.documentElement.lang.toLowerCase().startsWith('en')
    || (loginPage && query.get('portal_locale') === 'en');

  function candidatePage(path, useEnglish = false) {
    const params = new URLSearchParams({ channel: 'candidate', wf_path: path });
    if (/^r-\d{14}-[a-f0-9]{8}-[a-f0-9]{12}$/.test(release)) params.set('release', release);
    if (useEnglish) params.set('portal_locale', 'en');
    return '/page.php?' + params.toString();
  }

  const labels = english
    ? { guest: 'Sign in', account: 'My account', signedIn: 'You’re signed in.', signOut: 'Sign out', error: 'Could not sign out. Try again.' }
    : { guest: 'Prijavi se', account: 'Moj nalog', signedIn: 'Prijavljeni ste.', signOut: 'Odjavi se', error: 'Odjava nije uspela. Pokušajte ponovo.' };
  const accountUrl = candidate ? candidatePage('/prijava', english) : english ? '/prijava?portal_locale=en' : '/prijava';

  const views = accounts.map(account => {
    const view = {
      guest: account.querySelector('[data-es-account-guest]'),
      menu: account.querySelector('[data-es-account-menu]'),
      summary: account.querySelector('summary'),
      name: account.querySelector('[data-es-account-label]'),
      status: account.querySelector('[data-es-account-status]'),
      signOut: account.querySelector('[data-es-account-out]'),
      error: account.querySelector('[data-es-account-error]')
    };
    view.guest.textContent = labels.guest;
    view.guest.href = accountUrl;
    if (!view.name.textContent.trim()) view.name.textContent = labels.account;
    view.status.textContent = labels.signedIn;
    view.signOut.textContent = labels.signOut;
    return view;
  });

  const catalog = new Map();
  const pageChoices = document.querySelector('[data-es-account-catalog]');
  for (const entry of pageChoices?.content.querySelectorAll('[data-choice]') || []) {
    catalog.set(entry.dataset.choice, entry.dataset);
  }
  const menuSettings = document.querySelector('[data-es-account-settings]');
  const groups = new Map();
  function groupKey(value) {
    return typeof value === 'string' ? value.trim().normalize('NFC').toLowerCase() : '';
  }
  for (const row of menuSettings?.content.querySelectorAll('[data-group]') || []) {
    const key = groupKey(row.dataset.group);
    if (key && !groups.has(key)) groups.set(key, row.dataset);
  }

  function pageFor(choice, group, useEnglish = english) {
    const entry = catalog.get(choice);
    const translated = catalog.get(entry?.translation);
    const page = (useEnglish || entry?.localized) && translated
      && translated.path.startsWith('/en/') === useEnglish ? translated : entry;
    if (page?.allowedGroups && !page.allowedGroups.split('|').some(name => groupKey(name) === groupKey(group.group))) {
      return null;
    }
    return page;
  }

  function pageDestination(page) {
    return candidate && page.reviewPage ? candidatePage(page.path) : page.path;
  }

  if (loginPage) {
    window.elastycLoginDestination = user => {
      if (user?.userType !== 'C') return null;
      const group = groups.get(groupKey(user.userGroup));
      if (!group) return null;
      const page = pageFor(group.start, group);
      return page ? pageDestination(page) : null;
    };
  }

  function pageLink(page, title, className) {
    const link = document.createElement('a');
    link.href = pageDestination(page);
    link.className = className;
    link.textContent = title || page.title;
    return link;
  }

  function renderGroup(menu, group, signedIn) {
    const panel = menu.querySelector('.es-account-panel');
    panel.querySelector('.es-account-pages')?.remove();
    if (!signedIn) return;

    const featured = group ? pageFor(group.featured, group) : null;
    const links = group ? [group.link1, group.link2, group.link3, group.link4].map(choice => pageFor(choice, group)) : [];
    const used = new Set(featured ? [featured.path] : []);
    const content = document.createElement('div');
    content.className = 'es-account-pages';
    if (featured) {
      const draftTitle = english ? group.titleEn : group.titleSr;
      const draftDescription = english ? group.descriptionEn : group.descriptionSr;
      const card = pageLink(featured, draftTitle?.trim(), 'es-account-feature');
      const description = draftDescription?.trim();
      if (description) {
        const copy = document.createElement('span');
        copy.textContent = description;
        card.append(copy);
      }
      content.append(card);
    }
    for (const page of links) {
      if (!page || used.has(page.path)) continue;
      content.append(pageLink(page, '', 'es-account-page'));
      used.add(page.path);
    }
    const accountLink = document.createElement('a');
    accountLink.href = accountUrl;
    accountLink.className = 'es-account-page';
    accountLink.textContent = labels.account;
    content.append(accountLink);
    panel.insertBefore(content, panel.querySelector('[data-es-account-out]'));
  }

  const guestActions = headers.flatMap(header => Array.from(header.querySelectorAll('[data-es-guest-only]')));
  let sessionCheck = 0;
  let signingOut = false;
  let accountGroup = null;
  let accountUser = null;

  function accountRole(user) {
    const role = user?.userGroup?.trim();
    if (!role) {
      if (user?.userType === 'U') return english ? 'Employee' : 'Zaposleni';
      if (user?.userType === 'C') return english ? 'Customer' : 'Klijent';
      return labels.signedIn;
    }
    if (english && groupKey(role) === 'b2b korisnik') return 'B2B customer';
    if (english && groupKey(role) === 'b2b odgovorna osoba') return 'B2B account contact';
    return role;
  }

  function renderSession(signedIn) {
    for (const action of guestActions) action.hidden = signedIn;
    for (const view of views) {
      const focusInAccount = view.menu.contains(document.activeElement);
      view.guest.hidden = signedIn;
      view.menu.hidden = !signedIn;
      view.name.textContent = accountUser?.displayName?.trim() || labels.account;
      view.name.title = view.name.textContent;
      view.status.textContent = accountRole(accountUser);
      renderGroup(view.menu, accountGroup, signedIn);
      if (!signedIn) {
        view.menu.open = false;
        if (focusInAccount) view.guest.focus();
      }
    }
  }

  async function checkSession() {
    if (signingOut) return;
    const check = ++sessionCheck;
    let signedIn = views.some(view => !view.menu.hidden);
    let currentGroup = accountGroup;
    let currentUser = accountUser;
    try {
      const response = await fetch('/incKomponente/auth/config.php', {
        credentials: 'same-origin',
        cache: 'no-store',
        headers: { Accept: 'application/json' }
      });
      if (response.ok) {
        const session = await response.json();
        if (session.ok === true) {
          signedIn = !!session.user;
          currentUser = session.user || null;
          currentGroup = session.user?.userType === 'C' ? groups.get(groupKey(session.user.userGroup)) || null : null;
        }
      }
    } catch {
      // The normal sign-in link is usable if the check cannot complete.
    }
    if (check === sessionCheck && !signingOut) {
      accountGroup = currentGroup;
      accountUser = currentUser;
      renderSession(signedIn);
    }
  }

  async function signOut(view) {
    if (signingOut) return;
    signingOut = true;
    ++sessionCheck;
    for (const item of views) {
      item.signOut.disabled = true;
      item.error.hidden = true;
    }
    try {
      const response = await fetch('/incKomponente/auth/logout.php', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: '{}'
      });
      if (!response.ok || (await response.json()).ok !== true) throw new Error('Sign-out failed');
      accountGroup = null;
      accountUser = null;
      renderSession(false);
      window.location.replace(english ? '/en' : '/');
      return;
    } catch {
      signingOut = false;
      for (const item of views) item.signOut.disabled = false;
      view.error.textContent = labels.error;
      view.error.hidden = false;
      view.signOut.focus();
    }
  }

  for (const view of views) {
    view.signOut.addEventListener('click', () => signOut(view));
    view.menu.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || !view.menu.open) return;
      event.preventDefault();
      event.stopPropagation();
      view.menu.open = false;
      view.summary.focus();
    });
    view.menu.addEventListener('toggle', () => {
      if (view.menu.open) {
        view.error.hidden = true;
        for (const peer of views) if (peer !== view) peer.menu.open = false;
      }
    });
  }
  document.addEventListener('pointerdown', event => {
    for (const view of views) if (!view.menu.contains(event.target)) view.menu.open = false;
  });
  window.addEventListener('pageshow', event => { if (event.persisted) checkSession(); });
  checkSession();
})();
