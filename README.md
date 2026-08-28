# clientweb-templates

Git packovi za Elastyc **front Web Site Templates** (analog `common/Elastyc/Procesi`).

## Stabla

| Instanca | Export | Import |
|----------|--------|--------|
| `templategallery` | `{Folder}/` | isti folder |
| klijent | `{instance}/{Folder}/` | fork ako postoji `{Folder}.json`, inače kanon |

`Folder` = slug od `_templates.naziv`. Identitet je **naziv**, ne `templateid`.

## Pack

```
{Folder}/
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
