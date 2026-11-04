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
new-instance snapshot with `node tools/library-catalog.mjs --export-starter ../instance-template/webfront/Package/Library`, then run the engine's library,
render and deployment tests. Versioned files must never be edited after release;
changes require a new semantic version and new checksums. Git sync does not
install a package into a tenant Draft. Tenant installation and upgrade use the
reviewed Library panel. The legacy post-commit hook does not match this tree.

The central staging transport is generated with
`node tools/library-catalog.mjs --bundle packages/staged-bundle.json`. The regular
verification command also rejects a stale generated bundle. `--export-starter`
exports only the pinned base package; optional packages stay independent of engine
updates. `faq-sections@1.0.0` is the first optional package and depends on the base.
Patch `faq-sections@1.0.1` wraps long questions/answers, highlights an opened
question and refines the starting page copy. It retains the same item keys and
settings contract. Both versions stay in staging so Gallery can approve and test
them separately; existing tenant pages retain their copied content. A tenant's
local component change requires an explicit keep-local/use-library decision.

`product-catalog@1.0.0` reuses the engine's existing `product-list` and
`product-detail` definitions unchanged, with their existing `catalog-products`
and `catalog-product` query contracts. Two starting page templates use the base
starter layout; the package creates no pages or public routes. It requires
`starter-site@1.0.0`. Source verification pins the provider file bytes; engine
`LibraryProviderContracts` independently pins the complete canonical definitions.
The two providers contain no credentials, SQL, endpoint URLs or handler code.
Their server handlers remain part of the reviewed engine. The catalog-capable
Gallery feed distributes the complete approved package; the default feed keeps
serving compatible designs to older engines. Use a catalog-capable engine before
staging/approving/installing this release. Git sync alone does not install it.
Patch `product-catalog@1.0.1` keeps the same contracts and guards access to browser
storage itself, so the catalog also renders in an opaque sandboxed CMS preview.
Unavailable or full storage only disables remembered filter/scroll preferences.
The prior `1.0.0` remains immutable and is not approved for clients.
Patch `product-catalog@1.0.2` normalizes a serialized empty provider input (`[]`)
to a record before applying list search/category/sort state. This covers adding
the component as a first block without a page template; existing object input
and page content are retained. Detail, providers and templates are unchanged.
Patch `product-catalog@1.0.4` also tolerates denied History push/replace calls in
an opaque preview. Search, filters and sorting still reach the parent provider
when the browser cannot remember the URL; normal pages retain their URL state.
Only the list script changes. Existing detail customizations remain local.
The unapproved `1.0.3` staging attempt retained the old declared list payload;
its manifest remains immutable and must not be approved as the History fix.
Patch `product-catalog@1.0.5` additionally sends search through a plain button
and Enter handler. The isolated CMS blocks native form submission; its sandbox
permissions stay unchanged. Both search and facet changes use the existing
parent JSON provider. `1.0.3` and `1.0.4` remain unapproved staging history.

Gallery Admin: Biblioteka šablona → Preuzmi izdanja za proveru → choose the release
→ inspect and apply to Draft → build and inspect Candidate → reopen the library
→ Odobri izdanje za klijente. Approval requires the exact unmodified installed
package and a current verified Candidate, and keeps immutable private provenance.
Tenants use Proveri nova izdanja, choose an approved version, inspect local changes
and apply to Draft. Neither refresh nor approval publishes the public website.

`hero-sections@1.0.0` adds **Hero sa slikom** (`hero-visual`) and the
`hero-visual-page` starting layout. It includes heading, lead, image/alt, CTA and
left/right image position, with a responsive mobile layout. The initial image
slot explicitly asks the editor to choose their own tenant media; no remote
photo is borrowed. The existing text-only heroes retain their settings and
content. Further changes to `hero-visual` require a new package version through
the same Gallery approval and tenant upgrade flow. Run
`php tools/test-library-hero.php` with a sibling `instance-template` checkout to
validate the actual checksummed source using its planner, graph and renderer.

### Complete new-instance library

`packages/bootstrap.json` pins the complete first-install selection: starter,
FAQ, image Hero, product catalog and `repository-components`. Export it with
`node tools/library-catalog.mjs --export-starter ../instance-template/webfront/Package/Library`.
The exported catalog contains one exact version per package, with disjoint item
ownership and satisfied dependencies. It currently installs 31 component
contracts (all 24 engine repository components and seven additional designs),
five package receipts and no customer pages or tenant integration data.

`repository-components@1.0.0` preserves the existing 22 remaining engine
component definitions and their three declarative provider contracts. It adds
no handler code, permissions or connection settings. The internal finance widget
still needs a registered tenant integration; forms and data components need
existing tenant configuration. Branding/global content remain site settings.

For additions and updates, create a new immutable release, validate it on
Gallery, then expose it to clients through the approved library. Update the
explicit bootstrap pins when promoting the new baseline. The engine regression
`tests/webfrontRepositoryLibraryTest.php` compares every repository component
and latest package component with the actual initializer, and fails on omission
or drift. Do not edit previously released manifest/payload bytes.

`starter-site@1.1.0` keeps the original page templates and global instances,
adds opt-in logo-based header/footer components (three header layouts and two
footer layouts), and removes the starter shell's blanket image height override.
The new components require a configured site theme/logo and are chosen explicitly
in the shared editor. Existing client content is never switched by package apply.
Run `php tools/test-library-site-chrome.php` to validate all six combinations,
central brand bindings, preserved text/links and compatibility with the original
package. Bootstrap pins 1.1.0; older immutable releases remain available.
