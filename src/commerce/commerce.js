(function (global) {
  "use strict";
  if (global.ElastycCommerce) { global.ElastycCommerce.scan(); return; }
  var state = null, csrf = "", endpoint = "", queue = Promise.resolve(), quote = null;
  var items = new Map(), viewRoots = [], busy = false, channel = null;
  var authGeneration = 0, refreshingAuth = false;
  function themeContrast(host) {
    var raw = global.getComputedStyle(host).getPropertyValue("--wf-color-primary").trim();
    if (/^#[a-f0-9]{3}$/i.test(raw)) raw = "#" + raw.slice(1).split("").map(function (x) { return x + x; }).join("");
    if (!/^#[a-f0-9]{6}$/i.test(raw)) return;
    var rgb = [1, 3, 5].map(function (offset) {
      var v = parseInt(raw.slice(offset, offset + 2), 16) / 255;
      return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    var luminance = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
    document.documentElement.style.setProperty("--wf-shop-on-accent", luminance > 0.179 ? "#111111" : "#ffffff");
  }
  function node(tag, cls, text) {
    var el = document.createElement(tag); if (cls) el.className = cls;
    if (text !== undefined) el.textContent = text; return el;
  }
  function icon(name) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24"); svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor"); svg.setAttribute("stroke-width", "1.8");
    svg.setAttribute("aria-hidden", "true");
    var path = document.createElementNS(svg.namespaceURI, "path");
    path.setAttribute("d", name === "heart" ? "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" : "M3 3h2l2.4 12h11.2L21 7H6M9 21h.01M18 21h.01");
    svg.appendChild(path); return svg;
  }
  function money(value, currency) {
    return new Intl.NumberFormat("sr-RS", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(value) || 0) + "\u00a0" + (currency || "RSD");
  }
  function key() {
    var bytes = new Uint8Array(16); global.crypto.getRandomValues(bytes);
    return Array.from(bytes, function (x) { return x.toString(16).padStart(2, "0"); }).join("");
  }
  function safePath(path) { return typeof path === "string" && /^\/(?!\/)[^\s\\]*$/.test(path) ? path : "/"; }
  function linkTo(path, params) {
    var url = new URL(safePath(path), global.location.origin);
    Object.keys(params || {}).forEach(function (key) { url.searchParams.set(key, params[key]); });
    if (state && state.preview) {
      var route = url.pathname; url.pathname = "/page.php";
      url.searchParams.set("wf_path", route); url.searchParams.set("channel", "candidate");
    }
    return url.pathname + url.search;
  }
  function notify(text, error) {
    var el = document.querySelector("[data-wf-commerce-notice]");
    if (!el) { el = node("div", "wf-shop-notice"); el.setAttribute("role", "status"); el.setAttribute("data-wf-commerce-notice", ""); document.body.appendChild(el); }
    el.dataset.error = error ? "true" : "false"; el.textContent = text;
    global.clearTimeout(notify.timer); notify.timer = global.setTimeout(function () { el.textContent = ""; }, 6500);
  }
  function request(action, data, mutation, authChecked) {
    if (!endpoint) return Promise.reject(new Error("Otvorite direktan pregled stranice da koristite korpu."));
    var generation = authGeneration;
    var url = new URL(endpoint, global.location.href), options = { credentials: "same-origin", headers: { Accept: "application/json" }, cache: "no-store" };
    var purchase = new URLSearchParams(global.location.search).get("purchase");
    if (purchase) { if (!/^[a-f0-9]{32}$/.test(purchase)) return Promise.reject(new Error("Odobrenje kupovine nije validno.")); url.searchParams.set("purchase", purchase); }
    if (authChecked) options.headers["X-WF-Auth-Checked"] = "1";
    if (mutation) {
      options.method = "POST"; options.headers["Content-Type"] = "application/json";
      options.headers["X-WF-Commerce-CSRF"] = csrf;
      options.body = JSON.stringify(Object.assign({}, data, { action: action, expectedRevision: state ? state.revision : 0, idempotencyKey: data && data.idempotencyKey || key() }));
    } else { url.searchParams.set("operation", action); }
    return fetch(url.toString(), options).then(function (response) {
      return response.json().then(function (payload) {
        if (generation !== authGeneration) { var stale = new Error("Prijava je promenjena."); stale.silent = true; throw stale; }
        if (payload.refreshAuth && !authChecked) {
          return fetch("/incKomponente/auth/config.php", { credentials: "same-origin", cache: "no-store", headers: { Accept: "application/json" } }).then(function (authResponse) {
            if (generation !== authGeneration) { var stale = new Error("Prijava je promenjena."); stale.silent = true; throw stale; }
            if (!authResponse.ok) throw new Error("Prijava trenutno nije dostupna. Pokušajte ponovo.");
            return request(action, data, mutation, true);
          });
        }
        if (!response.ok || !payload.ok) { var error = new Error(payload.message || "Zahtev nije uspeo. Pokušajte ponovo."); error.status = response.status; throw error; }
        if (payload.csrf) csrf = payload.csrf;
        if (payload.state) { state = payload.state; render(); }
        if (payload.stateUnavailable) { notify("Promena je sačuvana. Osvežavanje pregleda trenutno nije dostupno."); global.setTimeout(function () { request("state", {}, false).catch(function () {}); }, 1000); }
        return payload;
      });
    });
  }
  function mutate(action, data, success) {
    var operationKey = key(), generation = authGeneration; busy = true; renderBusy();
    var run = queue.catch(function () {}).then(function () {
      if (generation !== authGeneration) { var stale = new Error("Prijava je promenjena."); stale.silent = true; throw stale; }
      return request(action, Object.assign({}, data, { idempotencyKey: operationKey }), true).then(function (result) {
        if (channel) channel.postMessage("refresh"); if (success) success(result); return result;
      }).catch(function (error) {
        if (error.status === 409) request("state", {}, false).catch(function () {});
        if (!error.silent) notify(error.message, true); throw error;
      }).finally(function () { busy = false; renderBusy(); });
    }); queue = run; return run;
  }
  function button(text, action, cls) {
    var b = node("button", cls || "wf-shop-btn", text); b.type = "button";
    b.addEventListener("click", function () { if (b.disabled) return; b.disabled = true; Promise.resolve().then(function () { return action(b); }).catch(function () {}).finally(function () { b.disabled = false; }); }); return b;
  }
  function quantity(value) {
    var input = node("input", "wf-shop-qty"); input.type = "number"; input.min = "0.001"; input.max = "100000"; input.step = "0.001"; input.value = value || "1";
    input.setAttribute("aria-label", "Količina"); input.inputMode = "decimal"; return input;
  }
  function actionFor(item, qty) {
    var mode = item["ordering-mode"], known = item["stock-known"] === true, available = known && Number(item.stock) > 0 && Number(item.stock) >= (Number(qty) || 0);
    if (mode === "Ponuda") return "inquiry";
    if (mode === "Dozvoljeno") return "buy";
    if (mode === "Ponuda kad nije dostupno") return known ? (available ? "buy" : "inquiry") : "unknown";
    if (mode === "Dozvoljeno kad je dostupno") return available ? "buy" : "unavailable";
    return "unavailable";
  }
  function mount(host, products) {
    if (!host || !host.querySelector("[data-commerce-enabled=true]")) return;
    (products || []).forEach(function (item) { if (item && item.id) items.set(String(item.id), Object.assign({}, item, { selectionVariant: "", selectionPending: false })); });
    host.querySelectorAll("[data-wf-item-id]").forEach(function (card) {
      if (card.closest("[data-wf-related]") || card.matches("a")) return;
      var id = card.getAttribute("data-wf-item-id"), item = items.get(id); if (!item) return;
      var slot = card.querySelector("[data-wf-shop-actions]");
      if (!slot) { slot = node("div", "wf-shop-actions"); slot.setAttribute("data-wf-shop-actions", ""); (card.querySelector(".wf-detail__summary") || card).appendChild(slot); }
      slot.dataset.wfVariants = Array.isArray(item.variants) && item.variants.length ? "true" : "false";
      var signature = JSON.stringify([actionFor(item), item.variants || [], item.unit, item["commerce-known"], item.selectionPending, item.selectionVariant, state && state.favoritesEnabled, state && state.favorites && state.favorites.some(function (x) { return x.productId === id; })]);
      if (slot.dataset.signature === signature) return;
      var previousQty = slot.querySelector(".wf-shop-qty"), previousVariant = slot.querySelector(".wf-shop-variant");
      var qtyValue = previousQty ? previousQty.value : "1", variantValue = previousVariant ? previousVariant.value : "";
      slot.dataset.signature = signature; slot.replaceChildren();
      var variant = null, qty = quantity(qtyValue), line = node("div", "wf-shop-actions__row");
      if (Array.isArray(item.variants) && item.variants.length) {
        variant = node("select", "wf-shop-variant"); variant.setAttribute("aria-label", "Varijanta");
        variant.appendChild(new Option("Izaberite varijantu", "")); item.variants.forEach(function (v) { variant.appendChild(new Option(v.label, v.id)); }); variant.value = variantValue; slot.appendChild(variant);
      }
      var action = actionFor(item), main = button(action === "inquiry" ? "Pošalji upit" : action === "unavailable" ? "Trenutno nedostupno" : "Dodaj u korpu", function () {
        if (!qty.reportValidity() || (variant && !variant.value)) { if (variant) { variant.setCustomValidity("Izaberite varijantu."); variant.reportValidity(); } return; }
        var data = { productId: id, variantId: variant ? variant.value : "", quantity: qty.value };
        if (actionFor(items.get(id), qty.value) === "inquiry") { global.location.assign(linkTo(state.paths.request, data)); return; }
        return mutate("add", data, function () { notify("Proizvod je dodat u korpu."); });
      });
      if (variant) variant.addEventListener("change", function () {
        variant.setCustomValidity(""); var selected = variant.value, item = items.get(id), selectionKey = key();
        item.selectionVariant = ""; item.selectionPending = !!selected; item.selectionKey = selectionKey;
        mount(host, []); if (!selected) return;
        mutate("selection", { productId: id, variantId: selected, quantity: qty.value }, function (result) {
          if (items.get(id).selectionKey !== selectionKey) return;
          var s = result.selection, offer = { id: id, selectionVariant: selected, selectionPending: false, "commerce-known": true, "ordering-mode": s.orderingMode,
            "price-known": s.priceKnown, price: Number(s.unitPrice), "regular-price": Number(s.regularPrice), "discount-percent": Number(s.discountPercent), "discount-active": Number(s.discountPercent) > 0,
            currency: s.currency, unit: s.unit, "stock-known": s.stockKnown, stock: s.stock };
          var root = host.querySelector("[data-commerce-enabled=true]");
          if (global.ElastycCatalogOffers && global.ElastycCatalogOffers.apply) global.ElastycCatalogOffers.apply(root, offer); else applyOffers(root, offer);
        }).catch(function () { if (items.get(id).selectionKey === selectionKey) { items.get(id).selectionPending = false; mount(host, []); } });
      });
      function refreshMain() {
        var current = items.get(id), currentAction = actionFor(current, qty.value);
        main.textContent = currentAction === "inquiry" ? "Pošalji upit" : currentAction === "unavailable" ? "Trenutno nedostupno" : "Dodaj u korpu";
        main.disabled = !state || current["commerce-known"] === false || current.selectionPending || (variant && !current.selectionVariant) || currentAction === "unavailable" || currentAction === "unknown";
        main.title = currentAction === "unknown" ? "Čeka se potvrda raspoloživosti." : "";
      }
      refreshMain(); qty.addEventListener("input", refreshMain);
      if (action === "buy" || action === "inquiry") { line.appendChild(qty); if (item.unit) { var unit = node("span", "wf-shop-unit", item.unit); line.appendChild(unit); } }
      line.appendChild(main);
      if (state && state.favoritesEnabled) {
        var active = state.favorites.some(function (x) { return x.productId === id; });
        var heart = button("", function () { return mutate("favorite", { productId: id, selected: !active }); }, "wf-shop-heart");
        heart.appendChild(icon("heart")); heart.setAttribute("aria-label", active ? "Ukloni iz favorita" : "Sačuvaj u favorite"); heart.setAttribute("aria-pressed", active ? "true" : "false"); line.appendChild(heart);
      }
      slot.appendChild(line);
    });
  }
  function applyOffers(root, item) {
    var old = items.get(String(item.id)); if (!old) return true;
    if (old.selectionVariant && item.selectionVariant !== old.selectionVariant) return false;
    items.set(String(item.id), Object.assign({}, old, item)); var host = root.closest(".wf-instance"); if (host) mount(host, []);
    return true;
  }
  function phoneValue(value) {
    value = value.trim();
    if (!value) return "";
    if (!/^[+0-9().\s-]+$/.test(value)) return null;
    var compact = value.replace(/[().\s-]/g, "");
    if (compact.indexOf("00") === 0) compact = "+" + compact.slice(2);
    if (/^0[1-9][0-9]{7,8}$/.test(compact)) compact = "+381" + compact.slice(1);
    if (!/^\+[1-9][0-9]{6,14}$/.test(compact)) return null;
    if (compact.indexOf("+381") === 0 && !/^\+381[1-9][0-9]{7,8}$/.test(compact)) return null;
    return compact;
  }
  function formatPhone(value) {
    var phone = phoneValue(value);
    if (phone && phone.indexOf("+381") === 0) {
      var national = phone.slice(4);
      return "+381 " + national.slice(0, 2) + " " + national.slice(2, 5) + " " + national.slice(5);
    }
    return phone === null ? value : phone;
  }
  function contactValidity(form, format) {
    var email = form.querySelector('[name="email"]'), phone = form.querySelector('[name="phone"]');
    if (email) {
      if (format) email.value = email.value.trim();
      email.setCustomValidity(email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()) ? "Unesite ispravnu email adresu, na primer ime@domen.rs." : "");
    }
    if (phone) {
      phone.setCustomValidity(phoneValue(phone.value) === null ? "Unesite ispravan telefon, na primer 064 123 4567 ili +381 64 123 4567." : "");
      if (format) phone.value = formatPhone(phone.value);
    }
  }
  function field(form, label, name, type, required, autocomplete) {
    var wrap = node("label", "wf-shop-field"), input = node(type === "textarea" ? "textarea" : "input");
    wrap.appendChild(node("span", "", label + (required ? " *" : ""))); input.name = name;
    if (type !== "textarea") input.type = type || "text"; input.required = !!required; input.maxLength = type === "textarea" ? 2000 : 160;
    if (type === "tel") { input.maxLength = 60; input.inputMode = "tel"; input.placeholder = "+381 64 123 4567"; }
    if (autocomplete) input.autocomplete = autocomplete; wrap.appendChild(input); form.appendChild(wrap); return input;
  }
  function selected(root, name) { var input = root.querySelector('[name="' + name + '"]'); return input ? input.value.trim() : ""; }
  function detailsData(form) {
    var result = {}; ["firstName", "lastName", "email", "phone", "street", "number", "postalCode", "city", "note", "delivery", "pickup", "payment", "addressId"].forEach(function (name) { result[name] = name === "phone" ? phoneValue(selected(form, name)) : selected(form, name); }); return result;
  }
  function optionField(form, label, name, options) {
    if (!options || !options.length) return null;
    var wrap = node("label", "wf-shop-field"), select = node("select"); select.name = name; select.required = true;
    wrap.appendChild(node("span", "", label)); options.forEach(function (option) { select.appendChild(new Option(option.label, option.id)); }); wrap.appendChild(select); form.appendChild(wrap); return select;
  }
  function cartRows(root, editable, source) {
    var list = node("div", "wf-shop-lines"); (source || state.lines).forEach(function (line) {
      var row = node("article", "wf-shop-line");
      if (line.imageUrl) { var img = node("img"); img.src = line.imageUrl; img.alt = ""; img.loading = "lazy"; row.appendChild(img); }
      var body = node("div", "wf-shop-line__body"), title = node("a", "", line.name || line.productId);
      title.href = linkTo(state.paths.product, { id: line.productId }); body.appendChild(title);
      body.appendChild(node("small", "", [line.variantLabel || "", line.productId].filter(Boolean).join(" · ")));
      body.appendChild(node("span", "", line.priceKnown ? money(line.unitPrice, line.currency) + (line.unit ? " / " + line.unit : "") : "Cena na upit"));
      if (line.issue) body.appendChild(node("p", "wf-shop-error", line.issue)); row.appendChild(body);
      var controls = node("div", "wf-shop-line__controls");
      if (editable) {
        var q = quantity(line.quantity); controls.appendChild(q);
        controls.appendChild(button("Sačuvaj", function () { if (!q.reportValidity()) return; return mutate("set", { lineId: line.lineId, quantity: q.value }); }, "wf-shop-link"));
        controls.appendChild(button("Ukloni", function () { return mutate("remove", { lineId: line.lineId }); }, "wf-shop-link"));
      } else controls.appendChild(node("span", "", line.quantity + " " + (line.unit || "kom")));
      controls.appendChild(node("strong", "", line.priceKnown ? money(line.total, line.currency) : "—")); row.appendChild(controls); list.appendChild(row);
    }); root.appendChild(list);
  }
  function totals(root, totals) {
    if (!totals) return; var box = node("div", "wf-shop-totals");
    [["Osnovica", totals.net], ["PDV", totals.tax], ["Ukupno", totals.gross]].forEach(function (pair) {
      var row = node("div"); row.appendChild(node("span", "", pair[0])); row.appendChild(node("strong", "", money(pair[1], totals.currency))); box.appendChild(row);
    }); root.appendChild(box);
    root.appendChild(node("p", "wf-shop-help", "Cene uključuju PDV. Eventualni trošak dostave potvrđuje prodaja prilikom obrade porudžbine."));
  }
  function renderCart(root) {
    if (!state.lines.length) { root.appendChild(node("p", "wf-shop-empty", "Vaša korpa je prazna.")); var back = node("a", "wf-shop-btn", "Pogledaj ponudu"); back.href = linkTo(state.paths.catalog); root.appendChild(back); return; }
    cartRows(root, true); totals(root, state.totals);
    var next = node("a", "wf-shop-btn", "Nastavi ka porudžbini"); next.href = linkTo(state.paths.checkout); root.appendChild(next);
  }
  function renderFavorites(root) {
    if (!state.favoritesEnabled) { root.appendChild(node("p", "wf-shop-empty", "Favoriti nisu uključeni za ovaj sajt.")); return; }
    if (!state.favorites.length) { root.appendChild(node("p", "wf-shop-empty", "Sačuvajte proizvode koji vas zanimaju klikom na srce.")); return; }
    state.favorites.forEach(function (item) {
      var row = node("article", "wf-shop-line"), a = node(item.available === false ? "span" : "a", "", item.name || item.productId);
      if (item.imageUrl) { var img = node("img"); img.src = item.imageUrl; img.alt = ""; img.loading = "lazy"; row.appendChild(img); }
      if (item.available !== false) a.href = linkTo(state.paths.product, { id: item.productId }); row.appendChild(a);
      row.appendChild(button("Ukloni", function () { return mutate("favorite", { productId: item.productId, selected: false }); }, "wf-shop-link")); root.appendChild(row);
    });
  }
  function renderCheckout(root, inquiry) {
    var returnedPayment = new URLSearchParams(global.location.search).get("paymentAttempt");
    if (!inquiry && returnedPayment && /^[a-f0-9]{32}$/.test(returnedPayment)) {
      root.appendChild(node("p", "wf-shop-help", "Provera statusa plaćanja…"));
      mutate("payment-status", { attemptId: returnedPayment }, function (result) { renderPayment(root, result.payment); }).catch(function (error) { root.replaceChildren(node("p", "wf-shop-error", error.message)); });
      return;
    }
    var rollbackTest = state.testMode === "rollback", realPurchase = !!state.purchase;
    if (realPurchase) root.appendChild(node("p", "wf-shop-preview", "Stvarna probna kupovina · " + money(state.purchase.amount, state.purchase.currency) + ". Jedan artikal, preuzimanje u objektu. Postojeća korpa ostaje sačuvana. Porudžbinu i plaćanje potvrđujete zasebno."));
    if (rollbackTest && state.authenticated) {
      root.appendChild(node("p", "wf-shop-preview", "Za ograničeni test odjavite kupca. CMS prijava ostaje aktivna.")); return;
    }
    if (!inquiry && !state.lines.length) { renderCart(root); return; }
    if (!inquiry && !state.authenticated && !state.guestCheckout) {
      root.appendChild(node("p", "", "Prijavite se da nastavite poručivanje.")); var login = node("a", "wf-shop-btn", "Prijava"); login.href = linkTo(state.paths.account); root.appendChild(login); return;
    }
    if (inquiry) {
      var params = new URLSearchParams(global.location.search); var productId = params.get("productId") || "";
      if (!productId) { root.appendChild(node("p", "wf-shop-error", "Izaberite proizvod za upit.")); return; }
      root.appendChild(node("p", "wf-shop-help", "Upit za artikal " + productId + (rollbackTest ? "." : ". Odgovor ćemo poslati na vaš email.")));
    }
    if (rollbackTest) root.appendChild(node("p", "wf-shop-preview", "Ograničeni test: koristi označene test podatke, proverava zaštitu i vraća poslovni upis. Nema slanja kupcu."));
    var form = node("form", "wf-shop-form"), panels = [], currentStep = 0, stepButtons = [], furthestStep = 0;
    form.noValidate = true; form.dataset.inquiry = inquiry ? "true" : "false";
    var contactPanel = form, deliveryPanel = form, paymentPanel = form;
    if (!inquiry) {
      var stepsNav = node("nav", "wf-shop-steps"); stepsNav.setAttribute("aria-label", "Koraci porudžbine");
      ["Kontakt i podaci", "Isporuka", "Plaćanje i potvrda"].forEach(function (title, index) {
        var control = button((index + 1) + ". " + title, function () { if (index <= furthestStep) goStep(index); }, "wf-shop-step");
        control.setAttribute("aria-controls", "wf-checkout-step-" + index); stepsNav.appendChild(control); stepButtons.push(control);
        var panel = node("section", "wf-shop-step-panel"); panel.id = "wf-checkout-step-" + index;
        var heading = node("h2", "", title); heading.tabIndex = -1; panel.appendChild(heading); panels.push(panel);
      });
      root.appendChild(stepsNav); contactPanel = panels[0]; deliveryPanel = panels[1]; paymentPanel = panels[2];
      panels.forEach(function (panel) { form.appendChild(panel); });
      if (!state.authenticated) contactPanel.appendChild(node("p", "wf-shop-help", "Nastavite bez naloga ili se prijavite da koristite svoje podatke i sačuvane adrese."));
    }
    field(contactPanel, "Ime", "firstName", "text", true, "given-name"); field(contactPanel, "Prezime", "lastName", "text", true, "family-name");
    field(contactPanel, "Email", "email", "email", true, "email"); field(contactPanel, "Telefon (opciono)", "phone", "tel", false, "tel");
    var customer = state.customer || {}, profileContact = customer.contact || {};
    ["firstName", "lastName", "email", "phone"].forEach(function (name) { var input = contactPanel.querySelector('[name="' + name + '"]'); if (input && typeof profileContact[name] === "string") input.value = profileContact[name]; });
    if (!inquiry) {
      var delivery = optionField(deliveryPanel, "Isporuka / preuzimanje", "delivery", state.deliveryOptions), address = node("div", "wf-shop-address");
      var addresses = Array.isArray(customer.addresses) ? customer.addresses : [], savedAddress = null;
      if (addresses.length) {
        var choices = [{id:"",label:"Unesi novu adresu"}].concat(addresses.map(function (item) { return {id:item.id,label:[item.label, item.street + " " + item.number, item.postalCode + " " + item.city].filter(Boolean).join(" · ")}; }));
        savedAddress = optionField(deliveryPanel, "Adresa za isporuku", "addressId", choices); savedAddress.required = false;
      }
      field(address, "Ulica", "street", "text", true, "address-line1"); field(address, "Broj", "number", "text", true, "address-line2");
      field(address, "Poštanski broj", "postalCode", "text", true, "postal-code"); field(address, "Mesto", "city", "text", true, "address-level2"); deliveryPanel.appendChild(address);
      if (savedAddress) {
        var newAddress = {};
        savedAddress.addEventListener("change", function () {
          var chosen = addresses.find(function (item) { return item.id === savedAddress.value; });
          ["street", "number", "postalCode", "city"].forEach(function (name) { var input = address.querySelector('[name="' + name + '"]'); if (chosen) { if (!input.readOnly) newAddress[name] = input.value; input.value = chosen[name]; } else input.value = newAddress[name] || ""; input.readOnly = !!chosen; });
          invalidateQuote();
        });
        if (addresses.length === 1) { savedAddress.value = addresses[0].id; }
        deliveryPanel.appendChild(button("Nova adresa", function () { savedAddress.value = ""; savedAddress.dispatchEvent(new Event("change")); address.querySelector("input").focus(); }, "wf-shop-link"));
      }
      var pickup = optionField(deliveryPanel, "Mesto preuzimanja", "pickup", state.pickupOptions);
      function toggleAddress() {
        var pick = delivery && delivery.value === "pickup"; address.hidden = pick;
        address.querySelectorAll("input").forEach(function (el) { el.required = !pick; });
        if (savedAddress) savedAddress.parentNode.hidden = pick;
        if (pickup) { pickup.parentNode.hidden = !pick; pickup.required = !!pick; }
      } if (delivery) delivery.addEventListener("change", toggleAddress); toggleAddress();
      var paymentSelect = optionField(paymentPanel, "Način plaćanja", "payment", state.paymentOptions);
      if ((state.paymentOptions || []).some(function (item) { return item.kind === "card"; })) paymentPanel.appendChild(node("p", "wf-shop-help", realPurchase ? "Kartica: AllSecure — stvarno plaćanje. Podatke kartice unosite na stranici banke." : "Kartica: Bankart TEST. Podatke kartice unosite na stranici banke."));
    }
    field(paymentPanel, "Napomena (opciono)", "note", "textarea", false);
    if (rollbackTest) {
      var testValues = {firstName:"Webfront",lastName:"TEST",email:"commerce-test@example.invalid",phone:"",street:"Test",number:"1",postalCode:"11000",city:"Test",note:"[WEBFRONT TEST " + state.testRunId + "]"};
      Object.keys(testValues).forEach(function (name) {
        var input = form.elements.namedItem(name);
        if (input) { input.value = testValues[name]; input.readOnly = true; input.autocomplete = "off"; }
      });
    }
    var errorBox = node("p", "wf-shop-error"); errorBox.setAttribute("role", "alert"); form.appendChild(errorBox);
    var review = node("div", "wf-shop-review"), submit = node("button", "wf-shop-btn", inquiry ? (rollbackTest ? "Pokreni test upita" : "Pošalji upit za ponudu") : "Proveri i prikaži pregled"); submit.type = "submit";
    var navigation = node("div", "wf-shop-step-actions"), back = null;
    if (!inquiry) { back = button("Nazad", function () { goStep(Math.max(0, currentStep - 1)); }, "wf-shop-link"); navigation.appendChild(back); }
    navigation.appendChild(submit); form.appendChild(navigation);
    var widgetId = null, confirm = null, confirming = false, requestingQuote = false, challenge = null;
    var needsProtection = realPurchase || ((!state.preview || rollbackTest) && (!state.authenticated || rollbackTest));
    var protectionReady = !needsProtection, protectionStatus = null, retryProtection = null;
    function updateConfirmation() {
      if (confirm) confirm.disabled = confirming || !quote || !protectionReady;
      if (inquiry) submit.disabled = requestingQuote || confirming || !protectionReady;
    }
    function protectionState(ready, message, retry) {
      protectionReady = ready;
      if (protectionStatus) { protectionStatus.textContent = message; protectionStatus.hidden = inquiry && ready; }
      if (retryProtection) retryProtection.hidden = !retry;
      updateConfirmation();
    }
    function invalidateQuote() { quote = null; confirm = null; review.replaceChildren(); submit.hidden = false; }
    function validStep(index) {
      contactValidity(form, true);
      var invalid = Array.from(panels[index].querySelectorAll("input,select,textarea")).find(function (input) { return !input.checkValidity(); });
      if (!invalid) return true;
      if (panels[index].hidden) goStep(index, false);
      invalid.reportValidity(); return false;
    }
    function goStep(index, focus) {
      currentStep = index; furthestStep = Math.max(furthestStep, index);
      panels.forEach(function (panel, i) { panel.hidden = i !== index; stepButtons[i].setAttribute("aria-current", i === index ? "step" : "false"); stepButtons[i].disabled = i > furthestStep; });
      back.hidden = index === 0; review.hidden = index !== 2;
      submit.textContent = index === 0 ? "Nastavi na isporuku" : index === 1 ? "Nastavi na plaćanje" : "Proveri i prikaži pregled";
      submit.hidden = index === 2 && !!quote;
      if (index === 2 && needsProtection && state.protection && state.protection.provider === "turnstile") loadProtection();
      if (focus !== false) panels[index].querySelector("h2").focus();
    }
    function resetProtection() {
      if (!needsProtection) return;
      protectionState(false, "Provera zaštite je u toku…", false);
      try {
        if (widgetId !== null && global.turnstile) global.turnstile.reset(widgetId);
        else loadProtection();
      } catch (error) { protectionState(false, "Zaštita nije uspela. Ponovite proveru pre slanja.", true); }
    }
    function submitQuote() {
      if (!quote || confirming || !protectionReady) return;
      var token = selected(form, "cf-turnstile-response");
      if (needsProtection && !token) { protectionState(false, "Potvrdite zaštitu pre slanja.", true); return; }
      confirming = true; updateConfirmation();
      return mutate("submit", { quoteId: quote.id, protectionToken: token }, function (result) {
        var test = result.receipt.test;
        if (widgetId !== null && global.turnstile) { try { global.turnstile.remove(widgetId); } catch (error) {} widgetId = null; }
        if (result.receipt.paymentRequired && !test) {
          var livePayment = result.receipt.paymentEnvironment === "live";
          root.replaceChildren(); root.appendChild(node("h2", "", livePayment ? "Porudžbina je primljena" : "Pregled je potvrđen"));
          root.appendChild(node("p", "wf-shop-preview", livePayment ? "Porudžbina " + result.receipt.caseKey + " je kreirana. Plaćanje još nije potvrđeno. Nastavite na bezbednu AllSecure stranicu." : "Bankart TEST: nastavite na test stranicu banke. Poslovna narudžbina nije kreirana."));
          root.appendChild(button(livePayment ? "Nastavi na AllSecure plaćanje" : "Nastavi na Bankart TEST", function () { return mutate("payment-start", { checkoutId: result.receipt.checkoutId }, function (reply) { renderPayment(root, reply.payment); if (reply.payment.redirectUrl) global.location.assign(reply.payment.redirectUrl); }); }));
          return;
        }
        root.replaceChildren(); root.appendChild(node("h2", "", test && test.rolledBack ? "Stvarni test je prošao" : result.receipt.preview ? "Provera je uspešna" : inquiry ? "Upit je poslat" : "Porudžbina je primljena"));
        root.appendChild(node("p", "", test && test.rolledBack ? "Zaštita je potvrđena. Provereni su predmet, dokument, stavke i veza. Test upis je vraćen." : result.receipt.preview ? "Ovo je pregled. Stvarna poslovna dokumenta nisu kreirana." : "Vaš broj: " + result.receipt.caseKey));
      }).catch(function (error) {
        errorBox.textContent = error.message;
        if (error.status === 409) invalidateQuote();
        resetProtection();
      }).finally(function () { confirming = false; updateConfirmation(); });
    }
    form.addEventListener("input", function (event) {
      if (event.target && event.target.name === "cf-turnstile-response") return;
      if (inquiry && (requestingQuote || confirming)) return;
      contactValidity(form, false); invalidateQuote();
    });
    form.addEventListener("focusout", function () { contactValidity(form, true); });
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (requestingQuote || confirming) return;
      contactValidity(form, true);
      if (!inquiry && currentStep < 2) { if (validStep(currentStep)) goStep(currentStep + 1); return; }
      if (!inquiry) { for (var index = 0; index < panels.length; index++) { if (!validStep(index)) return; } }
      else if (!form.reportValidity()) return;
      var data = { contact: detailsData(form), kind: inquiry ? "inquiry" : "order" };
      if (inquiry) { var p = new URLSearchParams(global.location.search); data.productId = p.get("productId"); data.variantId = p.get("variantId") || ""; data.quantity = p.get("quantity") || "1"; }
      if (inquiry && !protectionReady) return;
      errorBox.textContent = "";
      requestingQuote = true; submit.disabled = true;
      // Prevent edits from changing the contact between quote validation and submission.
      if (inquiry) Array.from(form.elements).forEach(function (input) { input.disabled = true; });
      var quoteRequest = inquiry && quote ? Promise.resolve() : mutate("quote", data, function (result) {
        quote = result.quote;
        if (inquiry) return;
        review.replaceChildren(); submit.hidden = true;
        review.appendChild(node("h2", "", inquiry ? "Pregled upita" : "Pregled porudžbine"));
        if (!inquiry) {
          var details = detailsData(form), summary = node("div", "wf-shop-confirmation-details");
          summary.appendChild(node("p", "", details.firstName + " " + details.lastName + " · " + details.email));
          summary.appendChild(node("p", "", details.delivery === "pickup" ? "Preuzimanje: " + ((state.pickupOptions || []).find(function (item) { return item.id === details.pickup; }) || {}).label : [details.street + " " + details.number, details.postalCode + " " + details.city].join(", ")));
          summary.appendChild(node("p", "", "Plaćanje: " + (((state.paymentOptions || []).find(function (item) { return item.id === details.payment; }) || {}).label || "Po dogovoru")));
          review.appendChild(summary);
        }
        cartRows(review, false, quote.lines); if (!inquiry) totals(review, quote.totals);
        if (quote.realPurchase) review.appendChild(node("p", "wf-shop-preview", "Potvrdom se kreira stvarna porudžbina. Kartično plaćanje pokrećete tek na sledećem ekranu."));
        if (quote.preview && !quote.realPurchase && !rollbackTest) review.appendChild(node("p", "wf-shop-preview", "Candidate pregled: završni korak proverava tok bez kreiranja stvarne porudžbine ili ponude."));
        confirm = node("button", "wf-shop-btn", rollbackTest ? (inquiry ? "Pokreni test upita" : "Pokreni test porudžbine") : (inquiry ? "Pošalji upit za ponudu" : quote.realPurchase ? "Potvrdi stvarnu porudžbinu" : "Potvrdi porudžbinu"));
        confirm.type = "button";
        confirm.addEventListener("click", submitQuote); review.appendChild(confirm); updateConfirmation();
      });
      quoteRequest.then(function () { if (inquiry && form.isConnected) return submitQuote(); })
        .catch(function (error) { errorBox.textContent = error.message; })
        .finally(function () {
          requestingQuote = false;
          if (inquiry) Array.from(form.elements).forEach(function (input) { input.disabled = false; });
          submit.disabled = false; updateConfirmation();
        });
    }); root.appendChild(form); root.appendChild(review);
    var protectionScript = null;
    function loadProtection() {
      if (!form.isConnected) return;
      if (global.turnstile) { challengeRender(); return; }
      if (protectionScript) return;
      var script = node("script"); protectionScript = script;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"; script.async = true;
      script.onload = function () {
        protectionScript = null;
        if (!form.isConnected) return;
        if (global.turnstile) challengeRender();
        else protectionState(false, "Zaštita se nije učitala. Ponovite proveru.", true);
      };
      script.onerror = function () { script.remove(); protectionScript = null; if (form.isConnected) protectionState(false, "Zaštita se nije učitala. Ponovite proveru.", true); };
      document.head.appendChild(script);
    }
    function challengeRender() {
      if (!form.isConnected || widgetId !== null) return;
      try {
        widgetId = global.turnstile.render(challenge, {
          sitekey: state.protection.siteKey, action: "case-form", cData: "commerce-checkout", appearance: inquiry ? "interaction-only" : "always", retry: "never",
          callback: function (token) { if (form.isConnected) protectionState(typeof token === "string" && token !== "", token ? "Zaštita je potvrđena." : "Potvrdite zaštitu pre slanja.", !token); },
          "error-callback": function () { if (form.isConnected) protectionState(false, "Zaštita nije uspela. Ponovite proveru pre slanja.", true); return true; },
          "expired-callback": function () { if (form.isConnected) protectionState(false, "Provera zaštite je istekla. Ponovite proveru pre slanja.", true); },
          "timeout-callback": function () { if (form.isConnected) protectionState(false, "Vreme za proveru zaštite je isteklo. Ponovite proveru.", true); }
        });
      } catch (error) { protectionState(false, "Zaštita nije uspela. Ponovite proveru pre slanja.", true); }
    }
    if (needsProtection) {
      var protection = node("div", "wf-shop-protection" + (inquiry ? " wf-shop-protection--quiet" : ""));
      challenge = node("div", "wf-shop-protection__widget");
      protectionStatus = node("p", "wf-shop-help", "Provera zaštite je u toku…"); protectionStatus.setAttribute("role", "status");
      retryProtection = node("button", "wf-shop-link", "Ponovi proveru"); retryProtection.type = "button"; retryProtection.hidden = true;
      retryProtection.addEventListener("click", resetProtection);
      protection.appendChild(challenge); protection.appendChild(protectionStatus); protection.appendChild(retryProtection); paymentPanel.appendChild(protection);
      if (state.protection && state.protection.provider === "turnstile") { if (inquiry || currentStep === 2) loadProtection(); }
      else protectionState(false, "Zaštita trenutno nije dostupna. Pokušajte ponovo kasnije.", false);
    }
    contactValidity(form, true); updateConfirmation();
    if (!inquiry) {
      goStep(0, false);
      if (savedAddress && savedAddress.value) savedAddress.dispatchEvent(new Event("change"));
    }
  }
  function renderPayment(root, payment) {
    var live = payment.environment === "live";
    root.replaceChildren(); root.appendChild(node("h2", "", live ? "AllSecure — plaćanje" : "Bankart / NLB — test plaćanje"));
    var labels = {starting:"Provera pokrenutog plaćanja je u toku.",redirect:"Nastavite plaćanje na stranici banke.",pending:"Banka obrađuje plaćanje.",unknown:"Ishod još nije potvrđen. Proverite status pre novog pokušaja.",authorized:"Predautorizacija je potvrđena. Sredstva nisu konačno naplaćena.",captured:"Plaćanje je potvrđeno.",failed:"Banka nije odobrila plaćanje.",cancelled:"Plaćanje je otkazano.",expired:"Plaćanje je isteklo."};
    root.appendChild(node("p", "wf-shop-preview", (live ? "Stvarno plaćanje · " : "TEST režim · ") + money(payment.amount, payment.currency)));
    root.appendChild(node("p", "", labels[payment.state] || "Proverite status plaćanja."));
    if (payment.redirectUrl) { var next = node("a", "wf-shop-btn", live ? "Otvori AllSecure plaćanje" : "Otvori Bankart TEST"); next.href = payment.redirectUrl; next.rel = "noreferrer"; root.appendChild(next); }
    root.appendChild(button("Proveri status plaćanja", function () { return mutate("payment-status", {attemptId:payment.id}, function (reply) {renderPayment(root, reply.payment);}); }, "wf-shop-link"));
    if (payment.retryAllowed) root.appendChild(button("Pokušaj ponovo", function () { return mutate("payment-start", {checkoutId:payment.checkoutId}, function (reply) {renderPayment(root, reply.payment);if(reply.payment.redirectUrl) global.location.assign(reply.payment.redirectUrl);}); }));
  }
  function renderAccount(root) {
    if (!global.ElastycFrontAuth) { root.appendChild(node("p", "", "Prijava se učitava…")); var script = node("script"); script.src = "/common/Elastyc/FrontAuth/front-auth.js"; script.onload = function () { root.replaceChildren(); renderAccount(root); }; script.onerror = function () { root.textContent = "Prijava trenutno nije dostupna."; }; document.head.appendChild(script); return; }
    global.ElastycFrontAuth.session({ apiBase: "" }).then(function (user) {
      root.replaceChildren();
      if (user) {
        root.appendChild(node("p", "", "Prijavljeni ste. Korpa i favoriti čuvaju se uz vaš nalog."));
        root.appendChild(button("Odjavi se", function () {
          return global.ElastycFrontAuth.logout({ apiBase: "" }).then(function (ok) {
            if (!ok) throw new Error("Odjava nije uspela.");
            // Do not leave account contents visible while a guest session is established.
            state = null; root.replaceChildren(); root.dataset.rendered = "false";
            return request("state", {}, false);
          }).catch(function (error) { notify(error.message, true); });
        })); return;
      }
      global.ElastycFrontAuth.init({ host: root, apiBase: "", returnUrl: linkTo(state.paths.cart), onSuccess: function () {
        return request("state", {}, false).then(function () { return mutate("resume", {}, function () { global.location.assign(linkTo(state.paths.cart)); }); });
      } });
    }).catch(function () { root.textContent = "Prijava trenutno nije dostupna."; });
  }
  function renderBusy() { document.querySelectorAll("[data-wf-shop-view]").forEach(function (root) { root.setAttribute("aria-busy", busy || refreshingAuth ? "true" : "false"); }); }
  function authChanged(announce) {
    if (!endpoint) return Promise.resolve();
    var generation = ++authGeneration;
    state = null; csrf = ""; quote = null; busy = false; refreshingAuth = true; queue = Promise.resolve();
    if (channel && announce !== false) channel.postMessage("auth-change");
    document.querySelectorAll("[data-wf-cart-count]").forEach(function (el) { el.textContent = "0"; });
    viewRoots.forEach(function (root) {
      if (root.dataset.wfShopView === "account") return;
      root.replaceChildren(node("p", "wf-shop-help", "Učitavanje…")); root.dataset.rendered = "false";
    });
    document.querySelectorAll(".wf-instance").forEach(function (host) { mount(host, []); });
    renderBusy();
    return request("state", {}, false).then(function () {
      if (state && state.mergeAvailable) return mutate("resume", {}, function () {});
    }).catch(function (error) {
      if (!error.silent) notify("Obnova korpe nije završena. Osvežite stranicu da pokušate ponovo.", true);
      throw error;
    }).finally(function () { if (generation === authGeneration) { refreshingAuth = false; renderBusy(); } });
  }
  function render() {
    if (!state) return;
    document.querySelectorAll("[data-wf-cart-count]").forEach(function (el) { var text = String(state.lines.length); if (el.textContent !== text) el.textContent = text; });
    document.querySelectorAll("[data-wf-favorites-link]").forEach(function (el) { el.hidden = !state.favoritesEnabled; });
    document.querySelectorAll("[data-wf-favorites-link]").forEach(function (el) { el.href = linkTo(state.paths.favorites); });
    document.querySelectorAll("[data-wf-cart-link]").forEach(function (el) { el.href = linkTo(state.paths.cart); });
    document.querySelectorAll("a[href]").forEach(function (el) {
      var url; try { url = new URL(el.getAttribute("href"), global.location.href); } catch (error) { return; }
      if (url.origin === global.location.origin && url.pathname === state.paths.account && !url.search && !url.hash) el.href = linkTo(state.paths.account);
    });
    document.querySelectorAll(".wf-instance").forEach(function (host) { mount(host, []); });
    viewRoots.forEach(function (root) {
      // Preserve form fields, focus and a reviewed quote during unrelated state updates.
      if (root.dataset.rendered === "true" && ["checkout", "request", "account"].indexOf(root.dataset.wfShopView) >= 0) return;
      root.replaceChildren(); root.dataset.rendered = "true";
      if (root.dataset.wfShopView === "cart") renderCart(root);
      if (root.dataset.wfShopView === "favorites") renderFavorites(root);
      if (root.dataset.wfShopView === "checkout") renderCheckout(root, false);
      if (root.dataset.wfShopView === "request") renderCheckout(root, true);
      if (root.dataset.wfShopView === "account") renderAccount(root);
    }); renderBusy();
  }
  function scan() {
    document.querySelectorAll("[data-wf-shop-view]").forEach(function (root) { if (viewRoots.indexOf(root) < 0) viewRoots.push(root); });
    if (endpoint) { render(); return; }
    var host = document.querySelector("[data-wf-commerce-url]"); if (!host) { viewRoots.forEach(function (root) { root.textContent = "Za proveru korpe i formi otvorite direktan Candidate pregled."; }); return; }
    themeContrast(host);
    if (global.parent !== global && host.dataset.wfCatalogBridge === "true") { viewRoots.forEach(function (root) { root.textContent = "Za interaktivnu proveru korpe otvorite direktan Candidate pregled."; }); return; }
    endpoint = host.dataset.wfCommerceUrl;
    request("state", {}, false).then(function () {
      if (state.mergeAvailable) return mutate("resume", {}, function () {});
    }).catch(function (error) { notify(error.message, true); });
    if (global.BroadcastChannel) { channel = new BroadcastChannel("wf-commerce-" + (new URL(endpoint, global.location.href).searchParams.get("channel") || "production")); channel.onmessage = function (event) { (event.data === "auth-change" ? authChanged(false) : request("state", {}, false)).catch(function () {}); }; }
    global.addEventListener("focus", function () { request("state", {}, false).catch(function () {}); });
  }
  global.ElastycCommerce = { scan: scan, mount: mount, applyOffers: applyOffers, actionFor: actionFor, url: linkTo, authChanged: authChanged };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", scan); else scan();
})(window);
