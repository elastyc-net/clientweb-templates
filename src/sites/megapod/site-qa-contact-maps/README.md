# Megapod — provera linkova, telefon/tablet i kontakt mape

Zadatak od 18. novembra 2026. obuhvata pregled javnih linkova novog sajta,
prikaza na telefonu i tabletu i dosledno otvaranje mapa lokacija.

## Izmene

- Kontakt: svaka od četiri kartice ima jedno dugme „Mapa i dolazak“.
  Zajednički native dialog prikazuje odabranu mapu, naziv, adresu i link
  „Pokrenite navigaciju“. Nema duplih kartičnih linkova za mapu niti
  razvlačenja kartice nadole. Svaka lokacija ima postojeći statički embed sa
  lazy učitavanjem; prikazuje se samo panel izabrane lokacije. Zatvaranje radi dugmetom, Escape tasterom i klikom na
  pozadinu; fokus se vraća dugmetu lokacije.
- Kartice koriste flex raspored kako bi akcije salona i Magacina bile
  poravnate pri dnu reda. Tablet ima čitljivije kontakt podatke. Stabilan
  prostor za scrollbar sprečava horizontalno pomeranje pri otvaranju mape.
- Reference: polja za pretragu i izbor imaju 16 px na telefonu i tabletu;
  na uskim ekranima prikazana su u jednoj koloni. Podaci i filter logika
  svih 89 projekata ostaju isti.
- Globalni footer: zastareli Mastercard URL otvarao je „Page not found“.
  Zamenjen je potvrđenom zvaničnom stranicom za autentifikaciju identiteta.

Adrese, telefoni, radno vreme, postojeće četiri Google embed mape i ispravan
Instagram profil nisu menjani. Google Directions URL se formira iz istih
postojećih odredišta, po [zvaničnoj dokumentaciji](https://developers.google.com/maps/documentation/urls/get-started#directions-action).
Nova [Mastercard adresa](https://www.mastercard.com/rs/sr/biznis/cybersecurity-fraud-prevention/identity/authentication.html)
potvrđena je u browseru preko njihove aktuelne navigacije.

## Izvori i CMS tok

`contact.css`, `maps.js` i `reference.css` su izvori. `prepare.mjs` prihvata
ograničeni trenutni baseline za Kontakt i Reference, generiše `kontakt.json`
i dva očekivana Draft zapisa. `prepare-footer.mjs` iz zasebnog trenutnog
footer baseline-a priprema zamenu tačno jednog zastarelog linka:

```sh
node src/sites/megapod/site-qa-contact-maps/prepare.mjs scoped-pages.json writes.json
node src/sites/megapod/site-qa-contact-maps/prepare-footer.mjs scoped-footer.json footer-writes.json
```

Generatori ne menjaju CMS. Save je urađen native adapterom uz očekivani
snapshot/revizije, validaciju definicija i composition grafa, backup samo
pogođenih zapisa i poređenje sačuvanih definicija. Ostali Draft zapisi i
release kanali ostali su isti tokom Save faza. Objava ide kroz native
Build Candidate → provera stvarnog Candidate-a → Publish.

## Provere

`link-audit.json` sadrži rezultate anonimnog obilaska: 2.062 interne adrese
sa HTTP 200 i 107 ispravnih sidara. Obilazak prati nove stranice, kategorije,
paginaciju i povezane proizvode; proverava i povezane legacy uslove, bez
daljeg obilaska starog sajta. Nisu slati formulari, porudžbine ni upiti.

Provereno je i 154 jedinstvenih slika, CSS i JS resursa glavnih pet novih
stranica. Cloudflare email skripta i visitor tool skripta zahtevaju GET;
oba GET odgovora su 200. Email linkovi u stvarnom DOM-u pravilno su
dekodirani. Spoljni AllSecure link ostaje njihov zvanični URL; tokom
provere njihov sajt prikazuje obaveštenje o održavanju.

Chrome provera obuhvata 360, 390, 768 i 1024 px, glavne sadržajne stranice,
katalog/parkete/itisone, nalog, favorite, korpu, porudžbinu, upit i stvaran
proizvod. Pregledani su mobilna pretraga, filteri, izbor varijante bez
slanja upita, Reference pretraga i 12 → 24 prikaz, projektni dialog,
četiri mape i poravnanje akcija. Ovo je provera browser viewport-a,
ne fizičkih uređaja ili stvarnog plaćanja.

Tačne sačuvane revizije i javna provera objave nalaze se u `delivery.json`.
Legacy `/` ostaje aktivan; novi sajt zadržava HTTP i HTML `noindex`.

Objavljen release: `r-20261118220708-cbed73e7-85959e2cc143`.
Završna javna provera potvrđuje 56 kombinacija (14 prikaza × 4 širine)
bez horizontalnog prelivanja i sa istim release-om. Mapa Magacina na tabletu
i mapa Karađorđeve na telefonu potvrđeno učitavaju Google sadržaj na javnom
`/kontakt`, uz jedno aktivno mapno polje i ispravno zatvaranje.
