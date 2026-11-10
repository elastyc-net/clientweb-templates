# Elastyc — centralna tipografija

Odabrana kombinacija za ceo sajt: **Manrope 700 za naslove**, **Inter 400 za tekst**, **Inter 500 za meni**, **Inter 600 za dugmad**, osnovna veličina 16 px.

Engine ugovor u `instance-template` dodaje opciona polja `theme.typography.bodyWeight`, `menuWeight`, `buttonWeight` uz postojeći `headingWeight`. Kontrole su u **Podešavanja sajta → Tipografija**. Svaki tenant zadržava svoju temu; engine nadogradnja ne bira fontove drugim sajtovima niti menja njihove Draft-ove ili objave. Stari theme bez novih polja ostaje validan i ima podrazumevane vrednosti 400/500/600.

Komponente koriste `--wf-font-body`, `--wf-font-heading`, `--wf-body-weight`, `--wf-menu-weight`, `--wf-button-weight`, `--wf-heading-weight`. Engine podržava i `data-wf-typography="body|menu|button|heading"` i vezivanje novih težina kroz `themeBindings`, sa postojećim lokalnim override/reset mehanizmom. Google font fetcher preuzima stvarne izabrane težine, uključujući latin-ext, za isti Draft preview i immutable build.

## Izvori i opseg

- `typography.json` — samo odabrane globalne vrednosti; nije zamena za ceo `site-config` dokument.
- `components.css` — povezivanje postojećih Elastyc komponenti, njihovih naslovnih elemenata, menija, formi i dugmadi sa centralnim tokenima. Uključen je kroz `header-footer/layout.json`; `header-footer/prepare.mjs` ga osvežava.
- `components/*.json` — ažurirane native Draft definicije postojećih instaliranih komponenti. Promenjeni su samo font deklaracije i njihove težine; HTML, sadržaj, scripts, provideri i drugi ugovori ostaju isti.
- Postojeći izvori prilagođenih komponenti ažurirani su na svojim mestima: `../header-footer/{header.css,footer.css,layout.json,components/footer.json}` i `../baza-znanja/{kb-sales.css,components/hero.json}`.
- `delivery.json` — završne revizije i provere nakon čuvanja.

Devet Draft izmena obuhvata `site-config/site`, `layout/main-layout` i komponente `account-menu`, `elastyc-site-footer`, `kb-children`, `kb-sales-hero`, `navigation-menu`, `product-detail`, `product-list`. Svih 71 stranica ostaje u istom layout-u, sa nepromenjenim sadržajem i rutama. Istorijski immutable paketi biblioteke nisu prepisivani.

## Isporuka i provera

Centralni engine commit `cc15cc8f43656085bfac272ff161a4beeff02f94` uključuje tipografski ugovor `a303370`, spajanje tadašnjeg main-a i kompatibilnost font downloadera sa PHP 8.5. Svih 78 obaveznih PHP Webfront/agent testova prolazi; provereni su validacija težina, stari Draft, lokalni override-i, CSS uloge i stvarno tražene Google font težine. Native validator, kompletan composition graph i pravi Draft renderer proverili su svih devet promena.

Elastyc engine isporuka koristi postojeći manifest i plan-first GitHub workflow; dry-run #714 je proverio tačan commit. Korisnik je zasebno odobrio serversku isporuku. Čuvanje teme koristi repository `saveDraftItem` uz očekivane revizije i proveru početnog snapshot hash-a. **Content Build i Publish nisu deo ovog zadatka.**

Privatni preimage ostaje na serveru u `W:/agent-gallery-deploy/elastyc-typography-20261110-before.json`, a rezultat u `elastyc-typography-20261110-result.json`. Vraćanje se radi nad devet pojedinačnih definicija uz aktuelne revizije, bez vraćanja celog snapshot-a preko kasnijeg rada.
