# Megapod — O nama, Usluge i početna

Objavljeno 18. novembra 2026. kroz postojeći Webfront CMS. Nove stranice
`/o-nama` i `/usluge`, kao i dorađena početna `/megapod`, javno su dostupne
bez prijave. Legacy sajt i dalje služi `/`. Novi sajt šalje HTTP i HTML
`noindex,nofollow,noarchive`.

## Izmene

- O nama: novi tekst, fotografija salona, pristup izboru i ugradnji,
  informacije o salonima i magacinu, tri stvarna projekta i kontakt.
- Usluge: ugradnja, krojenje, mašinsko opšivanje i dostava; skokovi na
  odeljke, pregled radova, koraci dogovora i pristupačan native FAQ.
- Početna: stalno vidljive usluge umesto karusela, fotografije sa jasnim
  linkovima ka uslugama i izbor od tri reference sa direktnim otvaranjem
  projekta na stranici Reference.
- Globalni header i footer povezuju nove rute; footer dodaje Usluge.

Stari izvor sadržaja: [O nama](https://megapod.rs/index.php?pageid=A237)
i [Usluge](https://megapod.rs/index.php?pageid=A235). Četiri postojeće
usluge su sačuvane. Tekst je prerađen bez novih garancija, rokova,
cena ili nepotvrđenih brojčanih tvrdnji. Zastarele tvrdnje o 28 godina
iskustva i garantovanoj površini nisu prenete. Tri salona i magacin
odgovaraju postojećim kontaktnim lokacijama.

Korišćene su originalne javne fotografije Megapoda: `/docs/541.jpg`,
`/docs/43.jpeg`, `/docs/8310.jpg`, `/docs/4308.jpg` i `/docs/4310.jpg`.
Izbor referenci preuzima postojeći `../contact-references/projects.json`:
Bioskop Odeon, Privatni stan Kahrs SPC - herringbone i Padel teren.
Brojevi 89 i 14 označavaju sačuvani izbor projekata i vrsta obloga,
a ne ukupan broj izvedenih projekata preduzeća.

## Izvori i reprodukcija

`prepare.mjs` iz `pages.css`, `home.css` i postojećeg izbora projekata
generiše `o-nama.json`, `usluge.json` i `home-sections.json`:

```sh
node src/sites/megapod/about-services-home/prepare.mjs
```

Opciono prihvata putanju do ograničenog CMS baseline-a i izlazni `writes.json`.
Paket sadrži tačno pet native Draft zapisa: dve nove stranice, globalni
header, globalni footer i Home. Očekivane revizije i snapshot hash
sprečavaju prepisivanje paralelnih izmena. Sam generator ne menja CMS.

Sačuvano native `saveDraftItem` adapterom nakon provere definicija,
celog composition grafa i native rendera. Sačuvani zapisi ponovo su
upoređeni sa pripremljenim definicijama. Ostali Draft dokumenti i oba
release kanala ostali su identični tokom Save faze. Build Candidate i
Publish izvršeni su kroz postojeći autentifikovani CMS.

## Provere i isporuka

- `WorkspaceDefinitionValidator`, `CompositionGraphValidator` i native
  `DraftPreviewRenderer` prolaze za sve tri stranice.
- JavaScript generator prolazi proveru sintakse; HTML nema duplirane ID-jeve.
- Home, Usluge i O nama provereni su na 360, 768 i 1280 px bez horizontalnog
  prelivanja; Home i Usluge dodatno vizuelno provereni na 390 px.
- Finalni tablet hero prelazi u jednu kolonu na širinama do 900 px.
- Stvarni Candidate potvrđuje tačan release, robots zabranu, skok do
  krojenja i otvaranje FAQ odgovora.
- Anonimni HTTP zahtevi potvrđuju 200 i isti Production release za
  `/o-nama`, `/usluge`, `/megapod` i `/reference`. HTTP i HTML imaju
  `noindex`. `/` vraća legacy naslov Megapod bez Webfront release headera.

Release: `r-20261118200102-4d7ed1c0-b7f9c418ef46`.
Sačuvane CMS revizije i anoniman HTTP dokaz nalaze se u `delivery.json`.
Nije menjan Webfront engine, legacy pack, katalog ni postojeći podaci referenci.
