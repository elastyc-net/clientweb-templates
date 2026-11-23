(function (global) {
  "use strict";
  if (global.ElastycGuestCart) return;
  function id() { var a = new Uint8Array(16); global.crypto.getRandomValues(a); return Array.from(a, function (v) { return v.toString(16).padStart(2, "0"); }).join(""); }
  function product(value, empty) { if (typeof value !== "string" || (!empty && !value.trim()) || new TextEncoder().encode(value).length > 80 || /[,/\\\x00-\x1f\x7f]/.test(value)) throw new Error("Šifra proizvoda nije validna."); return value.trim(); }
  function quantity(value) { if (!/^\d+(?:\.\d{1,3})?$/.test(String(value)) || !Number.isFinite(Number(value)) || Number(value) < 0.001 || Number(value) > 100000) throw new Error("Unesite količinu od 0,001 do 100.000, sa najviše tri decimale."); return Number(value).toFixed(3); }
  function selection(value) {
    if (!value || !Array.isArray(value.lines) || !Array.isArray(value.favorites) || value.lines.length > 100 || value.favorites.length > 100) throw new Error("Lokalna korpa nije validna.");
    var seen = Object.create(null), rows = value.lines.map(function (line) {
      var p = product(line.productId), v = product(line.variantId || "", true), k = p + "\n" + v;
      if (seen[k]) throw new Error("Korpa ima ponovljenu stavku."); seen[k] = true;
      if (!/^[a-f0-9]{32}$/.test(line.lineId || "")) throw new Error("Lokalna stavka nije validna.");
      return {lineId:line.lineId, productId:p, variantId:v, quantity:quantity(line.quantity)};
    });
    return {lines:rows, favorites:Array.from(new Set(value.favorites.map(function (p) { return product(p); })))};
  }
  function create(bootstrap, changed, warning) {
    var storageKey = "wf-guest-cart-v1:" + bootstrap.siteKey + ":" + bootstrap.channel;
    var memory = null, warned = false, storageFailed = false, days = Math.max(1, Math.min(90, bootstrap.retentionDays || 30));
    function fresh() { return {version:1, revision:0, operationKey:id(), expiresAt:Date.now() + days * 86400000, lines:[], favorites:[], migrated:[], pending:null}; }
    function warn() { if (!warned) { warned = true; warning("Pregledač ne čuva korpu trajno. Izbor ostaje dostupan u ovom tabu."); } }
    function normalize(raw) {
      if (!raw || raw.version !== 1 || !Number.isSafeInteger(raw.revision) || raw.revision < 0 || !/^[a-f0-9]{32}$/.test(raw.operationKey) || !Number.isFinite(raw.expiresAt)) throw new Error("Lokalni zapis nije validan.");
      var content = selection(raw), next = Object.assign(fresh(), content, {revision:raw.revision,operationKey:raw.operationKey,expiresAt:raw.expiresAt});
      next.migrated = (Array.isArray(raw.migrated) ? raw.migrated : []).filter(function (v) { return /^[a-f0-9]{64}$/.test(v); }).slice(-16);
      if (raw.pending) { if (!/^[a-f0-9]{32}$/.test(raw.pending.key)) throw new Error("Prenos nije validan."); next.pending = Object.assign({key:raw.pending.key,legacyKey:/^[a-f0-9]{64}$/.test(raw.pending.legacyKey || "") ? raw.pending.legacyKey : ""}, selection(raw.pending)); }
      if (next.expiresAt < Date.now() && !next.pending) { next.lines = []; next.favorites = []; }
      return next;
    }
    function read() {
      if (storageFailed) return memory || (memory = fresh());
      try { var raw = global.localStorage.getItem(storageKey); if (raw && raw.length > 131072) throw new Error("Prevelik zapis"); memory = raw ? normalize(JSON.parse(raw)) : memory || fresh(); }
      catch (error) { storageFailed = true; warn(); memory = memory || fresh(); }
      return memory;
    }
    function write(doc) {
      memory = doc;
      try { global.localStorage.setItem(storageKey, JSON.stringify(doc)); } catch (error) { storageFailed = true; warn(); }
      if (changed) changed(); return doc;
    }
    function edit(fn) {
      var run = function () { var doc = normalize(JSON.parse(JSON.stringify(read()))); fn(doc); if (doc.lines.length > 100 || doc.favorites.length > 100) throw new Error("Možete sačuvati najviše 100 stavki i 100 favorita."); doc.revision++; doc.operationKey = id(); doc.expiresAt = Date.now() + days * 86400000; write(doc); return snapshot(doc); };
      return global.navigator.locks && global.navigator.locks.request ? global.navigator.locks.request(storageKey, run) : Promise.resolve().then(run);
    }
    function snapshot(doc) { doc = doc || read(); return {key:doc.operationKey, revision:doc.revision, lines:doc.lines.map(function (l) { return Object.assign({}, l); }), favorites:doc.favorites.slice()}; }
    function apply(base) {
      var doc = read(), result = Object.assign({}, base, {revision:doc.revision,cartCount:doc.lines.length,favoriteCount:doc.favorites.length,authenticated:false,mergeAvailable:false});
      result.lines = doc.lines.map(function (l) { return Object.assign({}, l, {name:l.productId,priceKnown:false,eligible:false,action:"unknown",issue:"",unit:"",total:null}); });
      result.favorites = result.favoritesEnabled ? doc.favorites.map(function (p) { return {productId:p}; }) : [];
      result.totals = null; return result;
    }
    function mutate(action, data) {
      return edit(function (doc) {
        if (action === "favorite") { var p = product(data.productId), at = doc.favorites.indexOf(p); if (data.selected && at < 0) doc.favorites.push(p); if (!data.selected && at >= 0) doc.favorites.splice(at, 1); return; }
        if (action === "add") {
          var p = product(data.productId), v = product(data.variantId || "", true), q = quantity(data.quantity), old = doc.lines.find(function (l) { return l.productId === p && l.variantId === v; });
          if (old) old.quantity = quantity((Math.round(Number(old.quantity) * 1000) + Math.round(Number(q) * 1000)) / 1000);
          else doc.lines.push({lineId:id(),productId:p,variantId:v,quantity:q}); return;
        }
        var line = doc.lines.find(function (l) { return l.lineId === data.lineId; }); if (!line) throw new Error("Stavka više nije u korpi.");
        if (action === "set") line.quantity = quantity(data.quantity);
        else if (action === "remove") doc.lines = doc.lines.filter(function (l) { return l !== line; });
        else throw new Error("Radnja lokalne korpe nije validna.");
      });
    }
    function migrate(key, incoming) {
      var checked = selection(incoming);
      return edit(function (doc) {
        if (doc.migrated.indexOf(key) >= 0) return;
        checked.lines.forEach(function (line) { if (!doc.lines.some(function (l) { return l.productId === line.productId && l.variantId === line.variantId; })) doc.lines.push(line); });
        doc.favorites = Array.from(new Set(doc.favorites.concat(checked.favorites)));
        doc.migrated = doc.migrated.concat(key).slice(-16);
      });
    }
    function pending(force, favoritesEnabled) {
      var doc = read(); if (!force && !doc.lines.length && (favoritesEnabled === false || !doc.favorites.length) && !doc.pending) return null;
      if (!doc.pending) { doc.pending = Object.assign({key:doc.operationKey,legacyKey:bootstrap.legacyKey && doc.migrated.indexOf(bootstrap.legacyKey) >= 0 ? bootstrap.legacyKey : ""}, selection(doc)); if (favoritesEnabled === false) doc.pending.favorites = []; write(doc); }
      return Object.assign({}, doc.pending);
    }
    function consume(imported, keepFavorites) {
      return edit(function (doc) {
        doc.lines = doc.lines.map(function (line) {
          var old = imported.lines.find(function (l) { return l.productId === line.productId && l.variantId === line.variantId; });
          if (!old) return line;
          var remaining = Math.round(Number(line.quantity) * 1000) - Math.round(Number(old.quantity) * 1000);
          return remaining > 0 ? Object.assign({}, line, {quantity:quantity(remaining / 1000)}) : null;
        }).filter(Boolean);
        if (!keepFavorites) doc.favorites = doc.favorites.filter(function (p) { return imported.favorites.indexOf(p) < 0; });
        if (doc.pending && doc.pending.key === imported.key) doc.pending = null;
      });
    }
    global.addEventListener("storage", function (event) { if (event.key === storageKey || event.key === null) { memory = null; read(); if (changed) changed(); } });
    return {read:read,snapshot:snapshot,apply:apply,mutate:mutate,migrate:migrate,needsMigration:function (key) { return !!key && read().migrated.indexOf(key) < 0; },pending:pending,consume:consume};
  }
  global.ElastycGuestCart = {create:create};
})(window);
