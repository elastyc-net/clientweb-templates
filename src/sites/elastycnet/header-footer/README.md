# Elastyc — zajednički header, meni i footer

Predlog strukture i izgleda za ceo Elastyc Webfront sajt, sačuvan **samo kao Draft** na tenantu `elastycnet` 10. novembra 2026.

[Otvori Draft na stranici Baza znanja](https://elastyc.net/webfront-admin.php?page=tree-baza-znanja-2).

## Struktura menija

- **Rešenja** — mega meni: Prodaja, Nabavka, Podrška, Projekti, Ljudi i HR, Marketing. Svaka grupa ima odabrane podstranice. Baza znanja je izdvojena pod Podrškom.
- **Platforma** — pregled, AI asistenti i agenti, automatizacija, komunikacija, analitika, integracije i katalog proizvoda.
- **Resursi** — dokumentacija i uputstva, demonstracije, primeri primene i novosti.
- **O nama** — direktan link.
- **Prijava** i **Razgovarajmo** — odvojene akcije headera; na mobilnom su unutar menija.

Footer povezuje rešenja, platformu, resurse i kompaniju, uz poziv na razgovor i zvanični Elastyc logo. Prodajna stranica Baza znanja i postojeća dokumentacija imaju odvojene linkove. Sve adrese vode na postojeće Draft rute ili postojeću prijavu; nisu dodavani izmišljeni pravni ili kontakt podaci.

## Uređivanje u Webfrontu

U **Podešavanja sajta → Zaglavlje** dostupni su logo, glavni meni i akcije headera. Glavni meni koristi postojeći strukturirani editor `navigation-tree-v1`; oznake, adrese, redosled i hijerarhija uređuju se kroz CMS. Footer ima podešavanja teksta i ponavljajuće grupe linkova u **Podnožje**.

Zajednički delovi su povezani kroz `main-layout`, koji koristi svih 71 sačuvanih Draft stranica. Nijedan dokument stranice ni struktura sajta nisu menjani ovim predlogom. Sadržaj Baze znanja, procesi i članci ostali su netaknuti. Ranije komponente ostaju u biblioteci.

## Lokalni izvori

- `components/*.html` — čitljivi izvori novih komponenti.
- `header.css` — stil zajedničkog headera, ugrađen u `layout.json`.
- `navigation.js` — desktop i mobilno ponašanje menija, tastatura i Escape.
- `footer.css` — stil nove footer komponente.
- `components/*.json` — native definicije komponenti i njihovih CMS polja.
- `global-*.json` — instance zajedničkih delova, sadržaj menija i footera.
- `layout.json` — postojeći HTML layouta sa novim stilom i header podrazumevanim delovima.
- `delivery.json` — sačuvane revizije i rezultat završne provere.

Posle izmene HTML/CSS/JS izvora osvežiti native dokumente:

```sh
node src/sites/elastycnet/header-footer/prepare.mjs
```

Ova komanda menja samo lokalne JSON izvore. Za čuvanje u CMS korišćen je postojeći `webfront/bin/save-draft.php` / repository `saveDraftItem`, uz proveru očekivane revizije. Ovo nije legacy `_templates` paket: ne koristiti legacy import/apply alate nad ovim folderom.

## Provera i isporuka

Native `WorkspaceDefinitionValidator`, `CompositionGraphValidator` i `DraftPreviewRenderer` uspešno su proverili svih devet definicija. Završno čitanje CMS-a potvrđuje da svi lokalni dokumenti odgovaraju sačuvanim Draft definicijama, ostale definicije i tree nisu menjani, a sve 33 interne rute navigacije i footera postoje među Draft stranicama.

U stvarnom CMS preview-u provereni su desktop klik/hover, tastatura, mobilni meni, grupe, Escape, širina prikaza i footer. Nema zabeleženih browser console grešaka. Preview uređivača presreće klikove u režimu uređivanja; za interakciju sa menijem uključiti **Isprobaj stranicu**.

**Build i Publish nisu pokrenuti.** Candidate i Production kanali ostali su jednaki stanju neposredno pre čuvanja predloga. Postojeći release `r-20261006164113-21367dad-d00680221a71` nije napravljen niti objavljen ovim zadatkom. Git push i IIS sinhronizacija prenose izvore repozitorijuma, a ne objavljuju Draft sajta.

Privatni preimage backup i receipt ostaju u `W:/agent-gallery-deploy/elastyc-header-footer-20261110-before.json`, `elastyc-header-footer-20261110-result.json` i `elastyc-header-footer-20261110-final.json` na serveru. Za eventualno vraćanje koristiti samo prethodne četiri zajedničke definicije (`site-brand`, `site-navigation`, `site-footer`, `main-layout`) uz aktuelne očekivane revizije; ne vraćati ceo snapshot preko kasnijih izmena.
