# Baza znanja — prodajna Webfront stranica

Tenant/site: `https://elastyc.net` / `elastycnet`.

Native struktura: **Elastyc AI → Rešenja → Podrška → Baza znanja**.
Novi čvor je `A1081`, roditelj `A1021`, pageKey `tree-baza-znanja-2`.
Ruta: `/elastyc-ai/resenja/podrska/baza-znanja`.

Draft se otvara u [CMS-u](https://elastyc.net/webfront-admin.php?page=tree-baza-znanja-2).
Za čist interaktivni pregled kliknuti **Isprobaj stranicu**; za menjanje blokova
**Uredi nacrt**. Desktop/Mobile menjaju stvarnu širinu iframe-a.

## Sadržaj i uređivanje

Sedam nezavisnih statičnih Composition v1 komponenti u postojećem `main-layout`:
uvod, problem, unos/AI tok, primene, poverenje, FAQ i završni poziv na pregled.
Naslovi i uvodni tekstovi su obični native settings; FAQ je izmenjiva lista pitanja
i odgovora. Svaki blok ima svoj stabilan instanceKey i može da se premesti,
zameni ili ukloni u CMS-u.

`components/*.json` su native Draft dokumenti sa HTML/CSS/JS ugovorom.
`components/*.html`, `kb-sales.css` i `kb-sales.js` su čitljivi izvori. Posle izmene
tih fajlova pokrenuti `node src/sites/elastycnet/baza-znanja/prepare.mjs` iz korena
repoa da se kod ponovo ugradi u JSON. `page.json` čuva kompoziciju i sadržaj;
`navigation.json` prikazuje postojeći zajednički meni uz dodatu granu
Rešenja → Podrška → Baza znanja. `tree-create.json` beleži jednokratnu pregledanu
native create operaciju; ne ponavljati je kada čvor već postoji.

CSS je ograničen na `.kb-sales`; demo identifikatori imaju `kb-sales-` prefiks.
Postojeća tema, header, footer i njihove komponente nisu prepisani. Ilustracija
članka je lako zamenjiva unutar hero/scenarios komponente.

Tok iskustvo/dokument/izvor → AI predlog → provera tima je unapred pripremljen
marketinški primer. Nema snimanja, uploada, obrade fajlova, slanja zahteva ili
zakazivanja. AI je opcioni deo konkretne postavke; glasovni unos zavisi od
postojeće podrške. Git uvoz nije predstavljen kao stalna sinhronizacija.

## Isporuka 10.11.2026.

Sadržaj je sačuvan samo u **Draft** kroz postojeći `SiteTreePlan` i
`SqlsrvWebfrontRepository`, uz revizije i audit. Plan je prethodno validiran,
sačuvan je privatni preimage i provereni su graf i native Draft render.
Nema direktnog SQL upisa mimo tog authoring ugovora, novog PHP runtime-a,
migracije, promene dozvola, Candidate build-a ili Production objave.

Dokumentacijska Baza znanja `A1056` / `tree-baza-znanja` / `/elastyc-ai/baza-znanja`
i njeni potomci ostali su netaknuti, kao i sam KB proces i njegovi članci.
104 postojeće definicije van autorizovane navigacije ostale su iste.
Tačan rezultat provere i revizije su u `delivery.json`.

Git push/sync ovog izvora ne upisuje CMS Draft i ne objavljuje sadržaj.
Kasnije promene treba pripremiti prema aktuelnoj DB reviziji, zatim koristiti
postojeći Save Draft ugovor; Build Candidate i Publish ostaju zasebni koraci.

Provere: native definition/graph validacija i Draft render; desktop 1440 px i
mobile 390 px u stvarnom CMS-u; izvori/verzije i tastatura, lokalni scroll linkovi,
tri primene, ilustrativni AI ulazi, demo zatvaranje/Escape i FAQ. Nema
horizontalnog prelivanja, nedostajućih slika ili grešaka u konzoli u pregledanom
Draft-u. Otvaranje menija potvrđuje tačan novi link.
