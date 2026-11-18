# Megapod Wrapper — prijava

Code-only klijentski izvor postojećeg `Wrapper` template-a, lokalni ID 15.
Ova isporuka menja samo tri postojeća linka Prijava/Login/Registracija da vode na
`/nalog`. Zadržani su originalni HTML, klase, CSS i JavaScript. Inline click
zaustavlja legacy AJAX/parent handler, a browser prati običan href.

Nema kompletnog JSON pack-a niti recordseta; ne koristiti Import celog pack-a
za ovu izmenu. Primenjuje se samo HTML preko postojećeg code-only sync-a,
nakon objave i anonimne provere novog `/nalog`, uz proveru preimage-a i backup.

```sh
ELASTYC_SYNC_URL=https://megapod.rs/incKomponente/webtemplates/elastyc_webtemplate_code_upgrade.php node tools/sync-webtemplate-code.mjs Wrapper --instance megapodnew2
```

Aktivna legacy početna je A233 (Landing pages), sa `Wrapper` zaglavljem.
Ona i sve druge stranice zadržavaju postojeći runtime i sadržaj.
