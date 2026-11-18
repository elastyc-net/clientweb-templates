# Megapod — Kontakt, Reference i društvene mreže

Sačuvano u tenant CMS Draft 18. novembra 2026. i zatim, na izričit zahtev korisnika,
objavljeno normalnim CMS Build Candidate → provera → Publish tokom.
Javno izdanje: `r-20261118193604-d52bc9f4-5b821eea6ad2`.
Stari sajt ostaje na `/`; novi `/megapod`, `/kontakt` i `/reference` dostupni su
bez prijave, uz HTTP i HTML `noindex,nofollow,noarchive`.
SEO indeksiranje i završni prelazak glavne adrese nisu uključeni.

- `tree-kontakt`, `/kontakt`, legacy A238: tri salona i magacin, proverljivi
  telefoni, radno vreme, mape na otvaranje, pravac do lokacije i email upit.
- `tree-reference`, `/reference`, legacy A236: svih 89 postojećih projekata,
  14 vrsta podnih obloga, tri izdvojena projekta, tekstualna pretraga,
  kombinovanje tipa prostora i obloge, postepeni prikaz po 12 i pregled slike.
- Postojeći `design-main-layout-header`, `design-main-layout-footer` i
  `tree-megapod`: veze ka novim stranicama; Instagram i Facebook SVG ikonice
  sa nazivima i istim profilima kao na starom sajtu.

Izvori su javne stare stranice:
[Kontakt](https://megapod.rs/index.php?pageid=A238) i
[Reference](https://megapod.rs/index.php?pageid=A236).
Instagram: <https://www.instagram.com/_megapod_/>.
Facebook: <https://www.facebook.com/megapod.rs/>.

U kontaktima TC Zmaj ispravljeni su `tel:` linkovi: na starom sajtu vidljivi
Zmaj brojevi otvarali su brojeve salona Rakovica. Radno vreme i adrese preneti
su sa starog sajta. Za upit se otvara korisnikov email program; nova kontakt
forma ili server za slanje nisu uvedeni.

`projects.json` čuva stare nazive, tip obloge, fotografiju i izvorni link.
Vrsta prostora je urednička klasifikacija prema nazivu projekta. Broj projekata
je veličina prenetog skupa, ne tvrdnja o ukupnom broju realizacija firme.
Svaki projekat ima postojeću glavnu fotografiju. Kvadrature, godine, opisi
radova i dodatne fotografije nisu izmišljeni. Naredna sadržajna dorada može
za odabrane projekte dodati te podatke iz potvrđene dokumentacije klijenta.

## Izvor i priprema

`pages.css`, `references.js`, `social.html`, `projects.json` i `prepare.mjs`
su izvori. `kontakt.json` i `reference.json` su generisane CMS page definicije:

```sh
node src/sites/megapod/contact-references/prepare.mjs
```

Opciona tri argumenta su putanje ka usko izdvojenim metapodacima, postojećem
zaglavlju/podnožju i izlaznom paketu pet očekivanih CMS izmena. Osnova mora imati
isti snapshot hash. Ne pripremati novi paket iz zastarelih revizija.
Skripta ne čuva CMS, ne pokreće Build i ne objavljuje sadržaj.

Sačuvano je kroz postojeći `SqlsrvWebfrontRepository::saveDraftItem`, uz proveru
kompletnog grafa, očekivani snapshot i revizije. Backup samo pogođenih postojećih
dokumenata je u privatnom serverskom folderu
`W:/webfront-code-state/megapodnew2/contact-references-20261118/before.json`.
Ostali Draft dokumenti i oba release kanala ostali su identični tokom Save faze.
Naknadna odobrena objava promenila je Candidate/Production na gore navedeno
provereno izdanje, bez novog Draft upisa ili promene stare početne stranice.

## Provere

- Instalirani Megapod `WorkspaceDefinitionValidator`,
  `CompositionGraphValidator` i `DraftPreviewRenderer` prolaze.
- Sačuvane definicije su upoređene sa tačnim ulaznim paketom.
- Chrome desktop i 390 px: pretraga bez dijakritike, kombinovanje dva filtera,
  reset, prikaz 12 → 24, skrivanje dugmeta kad nema dodatnih rezultata,
  pregled projekta, mape, ispravni pozivi i društvene ikonice.
- Na telefonu nema horizontalnog prelivanja.
- JavaScript syntax i `git diff --check` prolaze.

CMS stranice su trajno dostupne kroz Webfront editor, ključevima `tree-kontakt`
i `tree-reference`. Privremeni owner-bound MCP pregledi imaju rok trajanja;
njihov istek ne uklanja sačuvani Draft.
