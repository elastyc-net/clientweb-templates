# Deltron · novi Webfront

Tenant-local Composition izvori za header, prijavu i **Prijava uređaja za jamstvo**. Ovo nije library paket niti legacy `_templates` import.

`node prepare.mjs` regeneriše sedam native definicija. `php verify.php /path/to/instance-template` proverava ugovore i serversku validaciju bez kreiranja predmeta. Definicije se čuvaju kroz standardni `saveDraftItem` / Save Draft sa očekivanom revizijom; manifest početno očekuje 0 i ne sme se koristiti za prepisivanje kasnijih CMS izmena.

Novi layout `deltron-layout` koristi samo novu globalnu sekciju `deltron-site-header`. Rute su `/prijava` i `/produljeno-jamstvo`; nema nove `/` stranice. Postojeće definicije, site-config, A157 i legacy template 117 ostaju nepromenjeni. Prijava koristi postojeći FrontAuth SDK i postojeće naloge. Nema registracionog adaptera. Grupna navigacija još nije definisana; prikazuju se provereni naziv grupe, profil i odjava.

`deltron-jamstvo.php` je lokalni backend koji se kopira **samo** u Deltron web root. Čita `front=T` polja i JSON opcije iz postojeće procesne definicije; ne prima naziv procesa, SQL, endpoint, userid ili ime priloga od browsera. Nepodržane kontrole/zavisnosti zatvaraju slanje do pregleda. Saglasnost `field1801` je obavezna i na serveru kao na postojećoj javnoj formi. Skrivena tabela uređaja ostaje skrivena.

Validacija prethodi uploadu i kreiranju: obaveznost, email, postojeći zajednički libphonenumber, datum, cena, proizvođač i veličina/MIME PDF/JPEG/PNG priloga. Novi nazivi fajlova su nasumični. Dokumenti se evidentiraju u `_docs` i povezuju sa predmetom. Poziva se postojeći `_el_client_newcase_newapp` sa njegovih 13 postojećih argumenata i `checkout=F`; procesni aftercase/custom hook-ovi se ne menjaju. Sve predato proverava se u `_serviceform` pre commit-a. Spoljna transakcija obuhvata SQL upise; pri potvrđenom rollback-u novi fajlovi se uklanjaju.

Posebna host-only HttpOnly sesija čuva CSRF, jednokratni zahtev i ishod. Dupli POST vraća isti rezultat; nejasan prekinut zahtev zahteva proveru umesto automatskog ponovnog kreiranja. Identitet je FrontAuth ili postojeći serverski anonimni nalog. Registracija/širenje prava nije deo ove isporuke.

**Status prvog reza:** Draft/Candidate pregled nema stvarno slanje. Backend ima dodatni operator gate: `incConn/deltron-jamstvo-live.php` mora eksplicitno vratiti `true`; fajl nije deo paketa i ne kreira se automatski. Ne uključivati ga pre kontrolisane funkcionalne probe, provere vlasništva/statusa/priloga, obaveštenja i indeksiranja, i eksplicitne paralelne objave. Stari obrazac i dalje šalje kao do sada.

Pre live aktivacije treba završiti proveru završnih koraka koje stari JS radi posle kreiranja (`publishDatanew`, mail i Elasticsearch insert). Novi endpoint ih još ne poziva i uspeh na mreži nije dokaz isporuke emaila. Ne uključivati live gate dok ti koraci nisu povezani i provereni; ne menjati shared ili tenant SQL naslepo.

Git/IIS source sync ne objavljuje Webfront. Production Publish ostaje zaseban, eksplicitan korak posle Candidate pregleda. Kanonski plan je u `common/docs/plans/deltron-webfront-jamstvo.md`.
