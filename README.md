# clientweb-templates

Git packovi za Elastyc **front Web Site Templates** (analog `common/Elastyc/Procesi`).

## Stabla

| Instanca | Export | Import |
|----------|--------|--------|
| `templategallery` | `templategallery/{Folder}/` | isti folder |
| klijent | `{instance}/{Folder}/` | fork ako postoji `{Folder}.json`, inače `templategallery/{Folder}` |

`Folder` = slug od `_templates.naziv`. Identitet je **naziv**, ne `templateid`.

## Pack

```
{instance}/{Folder}/
  {Folder}.json
  {Folder}.html
  {Folder}.js
  {Folder}.css
  {Folder}-scripts.html
  {Folder}-styles.html
  endpoints/{pageid}.sql
  endpoints/{pageid}.html
  COMPONENTS.md
INDEX.md
```

MD fajlovi su dokumentacija — import ih ignoriše. Runtime front sajta čita bazu; git je izvor definicije.

## Tok (isto kao procesi, samo drugi repo)

Dvosmerno preko GitHub `main`. Lokalni klon: `Documents/GitHub/clientweb-templates`. IIS: `W:\wwwroot\ElastycNet\clientweb-templates`.

| Smer | Šta se desi |
|------|-------------|
| Forma **Export u git** | PHP upiše pack → queue → `ElastycClientWebGitFlush` commit + **push** → lokalno `git pull` |
| Cursor (lokalno) | izmena packa → commit + **push** → `tools/server-sync-clientweb-templates.ps1` na IIS |
| Forma **Import iz gita** | PHP čita pack sa IIS diska (posle pull/sync) → tenant DB |

- PHP (tenant): `incKomponente/webtemplates/buildjsonwebtemplate.php` / `applyjsonwebtemplate.php`
- Cursor commit html/js/css/scripts/styles → `node tools/sync-webtemplate-code.mjs --last-commit` (post-commit hook)
- Ceo pack: `node tools/apply-webtemplate.mjs {Folder} [--instance {websyncinstance}]` — **ne** auto na commit

Van obima: Web Site Assets, Pages (`_sitestruct`), `_templatesback` (Elastyc forme).

## Webfront v2 library packages

`packages/catalog.json` is the immutable design library source, independent of
the legacy `templategallery/{Folder}` packs above. `starter-site@1.0.0` includes
four page templates, five static components, a layout and two shared sections.
It contains no pages, providers, tracking code, external assets or tenant secrets.

Verify content checksums with `node tools/library-catalog.mjs`. Export the pinned
new-instance snapshot with `node tools/library-catalog.mjs --export ../instance-template/webfront/Package/Library`, then run the engine's library,
render and deployment tests. Versioned files must never be edited after release;
changes require a new semantic version and new checksums. Git sync does not
install a package into a tenant Draft. Tenant installation and upgrade use the
reviewed Library panel. The legacy post-commit hook does not match this tree.
