(function () {
  'use strict';
  document.querySelectorAll('.wfmenu-nav').forEach(function (nav, navIndex) {
    if (nav.dataset.wfmenuReady) return;
    var header = nav.closest('[data-wf-header]');
    var chrome = nav.closest('.wfcr-header');
    var drawer = nav.querySelector('[data-wfmenu-drawer]');
    var toggle = nav.querySelector('[data-wfmenu-toggle]');
    var closeButton = nav.querySelector('[data-wfmenu-close]');
    var searchButton = nav.querySelector('[data-wfmenu-search-button]');
    var backdrop = nav.querySelector('[data-wfmenu-backdrop]');
    if (!header || !chrome || !drawer || !toggle || !backdrop || !closeButton) return;
    nav.dataset.wfmenuReady = 'true';
    var media = window.matchMedia('(max-width:1050px)');
    var mobile = true, open = false, bodyOverflow = null, inertNodes = [], lastTrigger = toggle;
    var uid = 'wfmenu-menu-' + navIndex;
    drawer.id = uid;
    toggle.setAttribute('aria-controls', uid);
    if (searchButton) searchButton.setAttribute('aria-controls', uid);
    var groups = Array.from(nav.querySelectorAll('[data-wf-menu-has-children="true"]')).map(function (item, index) {
      var button = Array.from(item.children).find(function (n) { return n.matches('[data-wfmenu-group-toggle]'); });
      var list = Array.from(item.children).find(function (n) { return n.matches('.wf-nav-children'); });
      if (!button || !list) return null;
      list.id = uid + '-group-' + index;
      button.setAttribute('aria-controls', list.id);
      button.setAttribute('aria-expanded', 'false');
      return { item: item, button: button, list: list, depth: Number(item.dataset.wfMenuDepth || 0) };
    }).filter(Boolean);
    var moved = [];
    [['.wfcr-search>.wf-slot','[data-wfmenu-search-slot]']].forEach(function (pair) {
      var source = chrome.querySelector(pair[0]), destination = nav.querySelector(pair[1]);
      if (!source || !destination) return;
      Array.from(source.children).forEach(function (node) {
        var marker = document.createComment('menu-slot');
        source.insertBefore(marker, node);
        moved.push({ node: node, marker: marker, destination: destination });
      });
    });
    function moveSlots(toMobile) {
      moved.forEach(function (entry) {
        if (toMobile) entry.destination.appendChild(entry.node);
        else if (entry.marker.parentNode) entry.marker.parentNode.insertBefore(entry.node, entry.marker);
      });
    }
    function setGroup(group, expanded) {
      group.button.setAttribute('aria-expanded', String(expanded));
      group.list.hidden = !expanded;
      group.item.dataset.wfmenuExpanded = String(expanded);
      if (!expanded) groups.forEach(function (child) {
        if (child !== group && group.list.contains(child.item)) {
          child.button.setAttribute('aria-expanded', 'false');
          child.list.hidden = true;
          child.item.dataset.wfmenuExpanded = 'false';
        }
      });
    }
    function resetGroups() {
      groups.forEach(function (group) { setGroup(group, !mobile && group.depth > 0); });
    }
    function closeDesktop(returnFocus) {
      var active = groups.find(function (group) { return group.depth === 0 && group.button.getAttribute('aria-expanded') === 'true'; });
      groups.filter(function (group) { return group.depth === 0; }).forEach(function (group) { setGroup(group, false); });
      if (!mobile) groups.filter(function (group) { return group.depth > 0; }).forEach(function (group) { setGroup(group, true); });
      if (returnFocus && active) active.button.focus();
    }
    function dimensions() {
      if (!mobile || !open) return;
      nav.style.setProperty('--wfmenu-menu-height', window.visualViewport ? Math.floor(window.visualViewport.height) + 'px' : '100dvh');
    }
    function lockBackground() {
      bodyOverflow = {overflow:document.body.style.overflow,position:document.body.style.position,top:document.body.style.top,width:document.body.style.width,y:window.scrollY};
      document.body.style.position='fixed';document.body.style.top=-bodyOverflow.y+'px';document.body.style.width='100%';document.body.style.overflow='hidden';
      inertNodes = Array.from(document.querySelectorAll('main,.wf-managed-footer')).filter(function (node) { return !node.contains(header); }).map(function (node) {
        var entry = { node: node, inert: node.inert };
        node.inert = true;
        return entry;
      });
    }
    function unlockBackground() {
      if (bodyOverflow !== null) { var saved=bodyOverflow;Object.assign(document.body.style,{overflow:saved.overflow,position:saved.position,top:saved.top,width:saved.width});bodyOverflow=null;window.scrollTo(0,saved.y); }
      inertNodes.forEach(function (entry) { entry.node.inert = entry.inert; });
      inertNodes = [];
    }
    function closeMobile(returnFocus) {
      if (!open) return;
      open = false;
      drawer.hidden = true;
      backdrop.hidden = true;
      header.removeAttribute('data-wf-menu-open');
      toggle.setAttribute('aria-expanded', 'false');
      if (searchButton) searchButton.setAttribute('aria-expanded', 'false');
      unlockBackground();
      resetGroups();
      if (returnFocus) lastTrigger.focus();
    }
    function openMobile(focusSearch) {
      if(profilePanel){profilePanel.hidden=true;if(avatar)avatar.setAttribute('aria-expanded','false');}
      if (!mobile) return;
      lastTrigger = focusSearch && searchButton ? searchButton : toggle;
      if (!open) {
        open = true;
        drawer.hidden = false;
        backdrop.hidden = false;
        header.setAttribute('data-wf-menu-open', 'true');
        toggle.setAttribute('aria-expanded', 'true');
        if (searchButton) searchButton.setAttribute('aria-expanded', 'true');
        lockBackground();
      }
      dimensions();
      var field = focusSearch ? drawer.querySelector('input[type="search"]') : null;
      (field || closeButton).focus({preventScroll:true});
    }
    function mode() {
      closeMobile(false);
      closeDesktop(false);
      mobile = true;
      chrome.dataset.wfmenuNavMode = mobile ? 'mobile' : 'desktop';
      moveSlots(mobile && nav.dataset.searchMode !== 'row');
      chrome.dataset.searchMode=nav.dataset.searchMode||'menu';
      drawer.hidden = mobile;
      backdrop.hidden = true;
      if (mobile) {
        drawer.setAttribute('role', 'dialog');
        drawer.setAttribute('aria-modal', 'true');
        drawer.setAttribute('aria-label', 'Meni i pretraga');
      } else {
        drawer.removeAttribute('role');
        drawer.removeAttribute('aria-modal');
        drawer.removeAttribute('aria-label');
      }
      resetGroups();
      var active = document.activeElement;
      if (mobile && drawer.contains(active)) toggle.focus();
      else if (!mobile && nav.contains(active) && (active.closest('[hidden]') || active.closest('.wfmenu-nav__drawer-head'))) {
        var primary = groups.find(function (group) { return group.depth === 0; });
        if (primary) primary.button.focus();
      }
    }
    toggle.addEventListener('click', function () { if (open) closeMobile(true); else openMobile(false); });
    if (searchButton) searchButton.addEventListener('click', function () { openMobile(true); });
    closeButton.addEventListener('click', function () { closeMobile(true); });
    backdrop.addEventListener('click', function () { closeMobile(true); });
    nav.addEventListener('click', function (event) {
      var button = event.target.closest('[data-wfmenu-group-toggle]');
      if (button && nav.contains(button)) {
        var group = groups.find(function (candidate) { return candidate.button === button; });
        if (!group || (!mobile && group.depth > 0)) return;
        var expand = button.getAttribute('aria-expanded') !== 'true';
        groups.forEach(function (other) {
          if (other !== group && other.item.parentElement === group.item.parentElement) setGroup(other, false);
        });
        setGroup(group, expand);
        if (!mobile && expand) groups.filter(function (child) { return child.depth > 0; }).forEach(function (child) { setGroup(child, true); });
        return;
      }
      if (event.target.closest('a')) { if (mobile) closeMobile(false); else closeDesktop(false); }
    });
    document.addEventListener('pointerdown', function (event) {
      if (!mobile && !nav.contains(event.target)) closeDesktop(false);
    });
    nav.addEventListener('focusout', function () {
      window.setTimeout(function () { if (!mobile && !nav.contains(document.activeElement)) closeDesktop(false); }, 0);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        if (mobile && open) { event.preventDefault(); closeMobile(true); }
        else if (!mobile) closeDesktop(true);
      }
      if (event.key !== 'Tab' || !mobile || !open) return;
      var nodes = Array.from(drawer.querySelectorAll('a[href],button,input,select,textarea,[tabindex="0"]')).filter(function (node) {
        return !node.disabled && !node.closest('[hidden]');
      });
      if (!nodes.length) { event.preventDefault(); drawer.focus(); return; }
      var first = nodes[0], last = nodes[nodes.length - 1], active = document.activeElement;
      if (event.shiftKey && (active === first || !drawer.contains(active))) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (active === last || !drawer.contains(active))) { event.preventDefault(); first.focus(); }
    });
    nav.querySelectorAll('a[href]').forEach(function (link) {
      try {
        var destination = new URL(link.getAttribute('href'), location.href), here = new URL(location.href);
        if (here.pathname === '/page.php' && here.searchParams.has('wf_path')) {
          var virtual = new URL(here.searchParams.get('wf_path'), here.origin);
          ['category','q','sort'].forEach(function (key) { if (here.searchParams.has(key)) virtual.searchParams.set(key, here.searchParams.get(key)); });
          here = virtual;
        }
        var same = destination.origin === here.origin && destination.pathname.replace(/\/$/, '') === here.pathname.replace(/\/$/, '');
        var keys = Array.from(destination.searchParams.keys());
        if (same && keys.every(function (key) { return destination.searchParams.get(key) === here.searchParams.get(key); }) && (!here.searchParams.has('category') || destination.searchParams.get('category') === here.searchParams.get('category'))) {
          link.setAttribute('aria-current', 'page');
        }
      } catch (ignore) {}
    });
    if (media.addEventListener) media.addEventListener('change', mode); else media.addListener(mode);
    window.addEventListener('resize', dimensions);
    if (window.visualViewport) window.visualViewport.addEventListener('resize', dimensions);
    window.addEventListener('pagehide', function () { closeMobile(false); });
    var avatar=nav.querySelector('[data-wfmenu-avatar]'), accountLink=nav.querySelector('[data-wfmenu-account-link]');
    function account(profile){
      if(!profile.authenticated || !avatar)return;
      var display=profile.displayName||(avatar.querySelector('[data-es-account-label]')||{}).textContent||'Moj nalog';
      avatar.hidden=false;avatar.href=profile.accountUrl;avatar.setAttribute('aria-label',display+' — Moj nalog');
      if(accountLink){accountLink.hidden=false;accountLink.href=profile.accountUrl;accountLink.textContent=display+' — Moj nalog';}
    }
    if(avatar && avatar.hidden){
      fetch('/page.php?wf_action=header-profile',{credentials:'same-origin',cache:'no-store',headers:{Accept:'application/json'}})
        .then(function(response){if(!response.ok)throw new Error('Profile unavailable');return response.json();})
        .then(account).catch(function(){});
    }else if(avatar && accountLink){accountLink.hidden=false;accountLink.textContent=(avatar.querySelector('[data-es-account-label]')?.textContent || 'Moj nalog');}
    window.addEventListener('elastyc:commerce-profile',function(event){if(event.detail&&event.detail.authenticated)account(event.detail);});
    var profilePanel=null;
    if(avatar){
      profilePanel=document.createElement('div');profilePanel.className='wfmenu-nav__profile';profilePanel.hidden=true;profilePanel.id=uid+'-profile';profilePanel.setAttribute('aria-label','Moj nalog');
      avatar.after(profilePanel);avatar.setAttribute('role','button');avatar.setAttribute('aria-expanded','false');avatar.setAttribute('aria-controls',profilePanel.id);
      function closeProfile(restore){profilePanel.hidden=true;avatar.setAttribute('aria-expanded','false');if(restore)avatar.focus({preventScroll:true});}
      function profileLink(label,url){var link=document.createElement('a');link.textContent=label;link.href=url;return link;}
      function showProfile(){
        if(!profilePanel.hidden){closeProfile(false);return;}
        profilePanel.replaceChildren();var title=document.createElement('strong');title.textContent=(avatar.getAttribute('aria-label')||'Moj nalog').replace(/\s*—.*$/,'');profilePanel.appendChild(title);
        profilePanel.appendChild(profileLink('Moj nalog',avatar.href));
        var retail=document.documentElement.dataset.wfShopAuthenticated==='true';
        if(retail&&nav.dataset.ordersEnabled==='true'&&nav.dataset.ordersUrl)profilePanel.appendChild(profileLink('Moje narudžbine',nav.dataset.ordersUrl));
        function authClient(){
          if(window.ElastycFrontAuth&&typeof window.ElastycFrontAuth.logout==='function')return Promise.resolve(window.ElastycFrontAuth);
          return new Promise(function(resolve,reject){var script=document.createElement('script');script.src='/common/Elastyc/FrontAuth/front-auth.js?v=23';script.onload=function(){if(window.ElastycFrontAuth&&typeof window.ElastycFrontAuth.logout==='function')resolve(window.ElastycFrontAuth);else reject(new Error('Prijava nije dostupna.'));};script.onerror=reject;document.head.appendChild(script);});
        }
        if(retail){
          var logout=document.createElement('button');logout.type='button';logout.textContent='Odjavi se';
          logout.onclick=function(){logout.disabled=true;authClient().then(function(auth){return auth.logout({apiBase:''});}).then(function(ok){if(!ok)throw new Error('Odjava nije uspela.');closeProfile(false);avatar.hidden=true;if(accountLink){accountLink.textContent='Prijava';accountLink.href=nav.dataset.accountUrl||'/nalog';}return window.ElastycCommerce?window.ElastycCommerce.authChanged():null;}).catch(function(){logout.disabled=false;logout.textContent='Pokušaj odjavu ponovo';});};profilePanel.appendChild(logout);
        }
        profilePanel.hidden=false;avatar.setAttribute('aria-expanded','true');
      }
      avatar.addEventListener('click',function(event){event.preventDefault();showProfile();});
      avatar.addEventListener('keydown',function(event){if(event.key===' '){event.preventDefault();showProfile();}});
      document.addEventListener('pointerdown',function(event){if(!profilePanel.contains(event.target)&&!avatar.contains(event.target))closeProfile(false);});
      document.addEventListener('keydown',function(event){if(event.key==='Escape'&&!profilePanel.hidden){event.preventDefault();closeProfile(true);}});
      window.addEventListener('elastyc:commerce-auth-changed',function(){closeProfile(false);});
    }
    mode();
  });
})();
