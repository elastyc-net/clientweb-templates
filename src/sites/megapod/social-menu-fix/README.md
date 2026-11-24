# Megapod — Instagram i strelica menija

Ispravka od 18. novembra 2026. ograničena na četiri CMS Draft zapisa:
globalni header, globalni footer, Home i Kontakt.

## Instagram

Stara adresa `https://www.instagram.com/_megapod_/` prikazuje nedostupnu
stranicu. Važeći profil je <https://www.instagram.com/_megapod/> — bez
završne donje crte. Profil je pronađen kroz Instagram pretragu, a identitet
potvrđen nazivom Megapod, prodajom i ugradnjom podova, adresom Karađorđeva 63
i vezom ka megapod.rs. Menjaju se tri linka: Home, Kontakt i globalni footer.
Facebook i ponašanje otvaranja linkova u novom tabu ostaju isti.

## Strelica

Postojeća strelica je kvadrat sa desnom i donjom ivicom, rotiran za 45°.
Flex centrira kvadrat, dok je nacrtani V optički ispod centra. `menu.css`
pomera zatvoreni V za 2 px nagore, a otvoreni za 2 px nadole nakon rotacije
za 225°. `flex-shrink: 0` čuva oblik na manjim širinama. Stil je dodat u
postojeći klijentski header; Webfront engine nije menjan.

## Reprodukcija

```sh
node src/sites/megapod/social-menu-fix/prepare.mjs scoped-baseline.json writes.json
```

Generator zahteva tačno četiri navedena zapisa i očekivanu staru adresu.
Priprema ograničeni paket sa snapshot hashom i očekivanim revizijama.
Sam generator ne čuva i ne objavljuje CMS.

Isporuka i provere zabeležene su u `delivery.json`. Native Save prethodi
Build Candidate-u, proveri stvarnog Candidate-a i eksplicitnom CMS Publish-u.
Legacy početna `/` i isključen SEO indexing ostaju sačuvani.

## Provere

Native validacija definicija i composition grafa prolazi. Ponovni pregled
sačuvanih definicija potvrđuje samo četiri promene polja: dodatak header CSS-a
i zamenu po jednog Instagram URL-a u ostala tri zapisa. Ostali Draft zapisi
i release kanali ostali su isti tokom Save faze.

Strelica je proverena zatvorena i otvorena na desktopu i u mobilnom meniju
širine 390 px, uključujući zatvaranje menija. Stvarni Candidate koristi nove
linkove, oba položaja strelice i `noindex`. Posle objave klik sa javne Home
stranice otvara potvrđeni Instagram profil. Anonimni HTTP zahtevi za Home,
Kontakt i O nama vraćaju 200, novu adresu i `noindex`; legacy `/` ostaje aktivan.

Objavljeni release: `r-20261118202059-916c22dc-6c0cd21aac59`.

## Standardna komponenta — 24. novembar 2026.

Korekcija je preneta u `src/chrome/navigation.css` i Megapod fullscreen-menu
izvor. Ista optička kompenzacija važi za oba položaja strelice; uklonjen je
suvišni `margin-left:6px` uz već postojeći flex gap od 8 px. Postojeća
immutable izdanja nisu menjana: novi `reference-chrome@1.1.1` sadrži samo
CSS promenu navigacije, a bootstrap je pinovan na novu verziju.
Validacija biblioteke proverava 109 izdanja / 961 fajl; 14 postojećih shared
navigation provera prolazi. Ostaje pun meni na računaru i hamburger na
mobilnom u Megapod lokalnoj prilagodbi. U istom CMS zadatku Home nacrt bez
`megapod-home-hero` uklanja promotivnu sekciju sa tri slike ispod finder-a.
