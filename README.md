Commerce 1.4.4 / catalog 2.5.4 retain the complete read contract for mixed cart/favorite/catalog compositions. Standalone lists keep their compact reads.

Commerce 1.4.3 / catalog 2.5.3 add dedicated cart/favorite read contracts, bounded display loading, compact local placeholders and retry without discarding confirmed rows. Checkout authority and authentication are unchanged.

Commerce 1.4.2 / catalog 2.5.2 add explicit saved-address selection and a New
address action, stable loading/retry states for cart/favorites/checkout, responsive
checkout spacing and a Turnstile theme matching the site surface. Guest lists
wait for verified names/prices and retain the last valid display during refresh. The shared
backend retains a verified customer's shipping address only after successful real
order confirmation. Build with `node src/commerce/build-checkout.mjs`; new-site
bootstrap pins both releases. Earlier immutable releases stay unchanged.

# clientweb-templates

Commerce 1.4.0 / catalog 2.5.0 / reference-chrome 1.1.0 provide the shared mobile drawer, optical cart icon, standalone auth spacing, customer order view and archived-product state. New-site bootstrap pins these releases. Build once with `node src/commerce/build-standard.mjs`, generate staging with `node tools/library-catalog.mjs --bundle packages/staged-bundle.json`, then export with `node tools/export-standard.mjs ../instance-template`. Published release bytes cannot be rebuilt. Orders links are enabled only where the corresponding page is configured; backend ownership remains authoritative.

Catalog 2.3.4 keeps favorite-only mobile list cards compact: the heart sits in
the card corner and does not create a separate bottom row. Titles reserve its
touch area. Actual category purchase controls retain their row. Build this
CSS-only release with `node src/catalog/build.mjs`; commerce stays at 1.3.2.

Catalog 2.3.3 / commerce 1.3.2 keep the mobile filter button with its funnel icon
beside the heading, with sorting and view controls together below. Cards reserve
an old-price row only when a discount exists. Saved catalog scroll is restored
for Back/Forward navigation, never a fresh menu/home visit or reload. Detail
choice/list modes hide nameless variants without making their parent buyable.
Build with `node src/commerce/build.mjs`; run `tools/test-catalog-actions.cjs`
and `tools/test-catalog-navigation.cjs` with jsdom, then regenerate staging.

Catalog 2.3.2 aligns filter disclosure arrows, checkbox labels and counts in
shared columns, and replaces grid/list text glyphs with accessible SVG icons.
It changes only the list component HTML/CSS; data, brand settings, commerce
runtime, provider contracts and all prior immutable releases are retained.
Build with `node src/catalog/build.mjs`, then regenerate and verify staging
with `node tools/library-catalog.mjs --bundle packages/staged-bundle.json`.

Commerce 1.2.11 / catalog 2.2.11 collapse the unused purchase footer in grid
cards when category purchasing is off or a card has only a corner favorite.
The footer is also collapsed before hydration, so loading offers/favorites does
not introduce an empty bottom bar. Cart-enabled simple products retain their
purchase controls. Settings, HTML, JavaScript and prior releases are preserved.

Commerce 1.2.10 / catalog 2.2.10 remove the redundant category variant CTA.
Category cards open their detail through the existing image/name link. The
component option **Dodavanje u korpu iz kategorije** defaults off; enabling it
permits purchase controls only for products without variants. Favorites remain
independent. Variant choice/list and authoritative purchase remain on the detail.
Existing releases, page settings and bootstrap pins are preserved.

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

`product-catalog@2.2.6` and `webfront-commerce@1.2.6` add compact responsive list
cards, separate brand/category and grid/list description controls, and detail
variant selection or a list of individually priced variant rows. Category cards
link to the detail instead of displaying variant selectors. Catalog-only pages
use a compact commerce summary; detail variant offers are loaded in one batch.
Build these immutable releases with `node src/commerce/build.mjs`, validate with
`node tools/library-catalog.mjs`, and test actions with
`node tools/test-catalog-actions.cjs` (jsdom required). The engine capability is
`catalog-compact-v1`; existing published versions remain unchanged.

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
ownership and satisfied dependencies. It currently installs 54 component
contracts, including the shared catalog and six commerce components,
seven package receipts and no customer pages or tenant integration data.

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

`product-catalog@1.2.0` preserves initial server-rendered catalog/detail nodes
while live offers update only price, discount and stock. It adds a price slider
with precise inputs, optional catalog toolbar controls, image-corner discount/tag
badges and SEO excerpts in list view. Defaults belong to the shared component;
tenant pages retain their own settings through an explicit Draft library upgrade.
The richer list contract requires the `catalog-presentation-v1` engine capability.

`starter-site@1.1.0` keeps the original page templates and global instances,
adds opt-in logo-based header/footer components (three header layouts and two
footer layouts), and removes the starter shell's blanket image height override.
The new components require a configured site theme/logo and are chosen explicitly
in the shared editor. Existing client content is never switched by package apply.
Run `php tools/test-library-site-chrome.php` to validate all six combinations,
central brand bindings, preserved text/links and compatibility with the original
package. Bootstrap pins 1.1.0; older immutable releases remain available.

## Retaining immutable export history

Bootstrap export keeps earlier immutable payloads already present in an engine
checkout when they match the verified canonical catalog byte for byte. The active
bootstrap catalog still selects one version per package. This avoids implicit
code removals when an installed engine moves to a newer bootstrap. Unknown or
modified historical files are rejected. Verify with
`node tools/test-library-export-history.mjs`.

`starter-site@1.2.0` extends the opt-in header/footer designs with a shop variant,
a contact footer, and nested actions/extras slots. Header templates retain menu
links and branding bindings; switching variants retains added components and
local presentation. Shop composition reuses the separately installed account and
cart components; these are configurable links, not live account/cart integration.
Old releases and existing global-section definitions remain byte-identical.
The CMS presents four header and three footer cards in Site settings, with an
explicit local choice, preview and Undo. Bootstrap pins 1.2.0; existing tenants
need an explicit library plan/apply and their own branding setup.

`starter-site@1.3.0` adds independent `site-header-zones`, `site-footer-zones`, `site-brand`, `site-links`, and `site-note` contracts. Four slots support horizontal header layouts, footer columns and a full-width lower row; mobile stacking and menu toggles are built in. Existing definitions/releases stay byte-identical. Presets explicitly convert a local shared draft, preserving content and configurable account/cart links. Bootstrap now pins 1.3.0; existing tenants require a reviewed library apply.

`product-catalog@1.1.0` promotes a server-rendered initial catalog/detail with
client hydration, ordered tenant front facets (including numeric ranges), real
pagination links and an independent visitor-specific live offers binding. It
refreshes current price, active discount, regular/final prices and stock only for
loaded eligible IDs. Display switches and catalog/detail routes are component
settings; tenant branding and page content are preserved. Semantic theme tokens
replace the old catalog's fixed palette. Bootstrap now pins 1.1.0, retaining the
immutable 1.0.5 payload for installed older contracts. This requires an engine
with `catalog-live-v1`, SSR hydration, named query providers and typed settings
defaults; older capability feeds exclude it. Source and engine independently pin
all three reviewed provider definitions. Engine deployment alone does not apply
an upgrade to existing tenant Drafts or publish content.

## Commerce account session lifecycle (1.0.4 / catalog 2.0.4)

The account default now embeds the shared registration and account bridge with
current FrontAuth styling. Login/logout clears the previous private commerce
view immediately, reloads the current account state and offers the existing
guest-cart merge. Old in-flight responses and queued mutations cannot cross an
identity change. The existing 1.0.3 and 2.0.3 releases remain immutable; upgrade
review continues to preserve local component customizations. Existing catalog
markup and pricing/stock updates retain their stable rendering behavior.

Patch `webfront-commerce@1.0.5` keeps those contracts and updates only the account
bridge's shared asset references to FrontAuth SDK20/CSS10. This preserves the
current registration/profile screen when a tenant upgrades an older locally
embedded account component. Earlier releases and all other payloads are unchanged.
That release was pinned after its Gallery Candidate verification and library
approval, preserving the reviewed account component for new installations.

Commerce1.0.6/catalog2.0.5 add a visible protection status and a manual widget
retry that preserves the reviewed quote. Initial load, error, expiry and timeout
keep the final button disabled; a success callback and a present response are
required before sending a mutation. Siteverify remains the server authority.
Stale quotes expose the review button again. Script callbacks ignore detached
forms after an account switch. `src/commerce/build.mjs` creates these versions
from the verified preceding releases, replacing only shared commerce JS/CSS;
existing release bytes, account bridge and tenant settings are preserved.
After four real browser order/inquiry write-and-rollback checks on Gallery and
Megapod, bootstrap now pins commerce1.0.6 and catalog2.0.5. Existing tenant Drafts
still require the normal reviewed library upgrade; engine source export does
not publish a site or replace its content.

Run `node tools/test-commerce-protection.cjs` with jsdom26 on the Node module
path. Its callback fixture verifies failure, retry, expiry, account changes and
submit gating; it is not a real Turnstile or business-write acceptance test.
Then validate the catalog and immutable history with
`node tools/library-catalog.mjs` and `node tools/test-library-export-history.mjs`.

The 2026-11-18 engine upgrade retains repository-components 1.0.2–1.0.5 from
the already installed, verified Gallery engine `925023a29e78`. Their bytes and
hashes are unchanged. Bootstrap keeps the existing Acquisition setup/copy in
1.0.5, alongside the new commerce versions; an upgrade must not silently drop
these installed contracts or their runtime helpers.

Commerce 1.2.1 / catalog 2.2.1 send product inquiries directly from the contact
form. One explicit click obtains a server-validated quote and submits it, without
an intermediate review. Contact edits and repeated clicks are blocked while the
request is pending; a retry retains the same quote unless it is stale. Inquiry
Turnstile uses `interaction-only`; server Siteverify and expiry/error handling
remain required. Order checkout keeps its existing review and payment steps.

Optional phones accept Serbian national numbers and international `+` / `00`
numbers. Serbian numbers are displayed with spaces and sent in international
format; invalid phones and email domains block sending. The commerce engine
also validates and normalizes phones in `CommercePolicy`. These checks validate
format, not mailbox ownership or telephone reachability.

Verify with `node tools/test-commerce-inquiry.cjs` and
`node tools/test-commerce-checkout.cjs` using the jsdom26 module path. The inquiry
fixture exercises the packaged 1.2.1 runtime, including retry and token expiry;
it does not replace real Candidate verification. Prior releases and bootstrap
pins stay unchanged until the normal Gallery and tenant library review.


Commerce 1.2.2 / catalog 2.2.2 add the shared `intl-tel-input` 29.1.2 country
picker to inquiry and checkout contact forms. Serbia is the initial country;
saved international numbers select their own country. National numbers are
formatted and validated for the selected country, including mobile and landline
numbers, and submitted as E.164. The existing `/common/intl-tel-input/dist/`
assets are loaded once per page, with a visible retry if loading fails. Optional
empty phone fields remain optional. Country changes invalidate an existing
quote; the picker locks during a direct inquiry send and is destroyed when the
form is removed. The source builder publishes new immutable packages; previous
versions, bootstrap pins, provider contracts and backend code are preserved.
`test-commerce-inquiry.cjs` and `test-commerce-checkout.cjs` run against the real
shared vendor library from the sibling `common` checkout.

Commerce 1.2.3 / catalog 2.2.3 keep the country dropdown as wide as its phone
input, including after responsive layout changes. The dropdown is positioned
inside the narrow country-button container, so its maximum width must be
bounded by the viewport rather than by that container.

Commerce 1.2.4 / catalog 2.2.4 show inquiry fields before contact context arrives,
preserve edits/autofill and focus during prefill, and request the bounded inquiry
read model. Current engines return only a scoped cart count/revision and verified
contact; older engines retain their full-state response. Sending still requires
the normal CSRF, current quote and protection checks. Concurrent state reads are
shared per identity, fresh state is not fetched again on each focus, and older
responses cannot repaint newer state. Placeholder styling follows the public
theme's optional `--wf-color-placeholder` with its muted color as fallback.
Verify `tools/test-commerce-loading.cjs` as well as inquiry/checkout/protection.

Patch 1.2.5 / 2.2.5 keeps the full state for mixed pages that also contain
commerce product widgets. Pending reads are shared only within the same view
and identity; adding a cart/product widget upgrades a compact read to full state.

Patch 1.2.7 / 2.2.7 restores Turnstile's automatic retry and token/timeout
refresh with its standard eight-second retry interval. A failed or expired check
still blocks sending until a fresh successful callback; recovery never submits
the form. The status element retains only a six-digit support code (or `unknown`)
in `data-wf-protection-error`, never a token or raw diagnostic text.

Patch 1.2.8 / 2.2.8 keeps the verified 1.2.7 / 2.2.7 runtime and includes variant
rows in the shared commerce theme and box-sizing scope, so quantity inputs and
cart buttons retain the site palette and borders outside the parent action slot.


Commerce 1.3.0 / catalog 2.3.0 use a guest-local adapter when the engine provides
a verified display bootstrap from built site settings. Guest favorites/cart
choices update localStorage and both header counters immediately; cart entry
batches live repricing. An old server guest selection migrates once. Login
imports use the existing protected cart API; checkout retains CSRF, ownership,
revision, idempotency and live quote/submit checks. Older engines retain the
existing server behavior. No auth token, price or personal contact is persisted
by the guest adapter. Storage failure has a visible in-memory fallback.

Build with src/commerce/build.mjs, regenerate packages/staged-bundle.json, and
verify tools/test-commerce-guest-local.cjs alongside the existing loading,
catalog, inquiry, checkout and protection suites using jsdom26. Bootstrap pins
and all prior immutable package bytes remain unchanged until Gallery approval.

Commerce 1.3.1 / catalog 2.3.1 use the shared email field control in pending
inquiry, ready inquiry and checkout forms. It validates required values and
address syntax on blur and before sending, trims outer whitespace and shows an
associated inline error that clears on correction. Server validation remains
authoritative; syntax validation does not verify mailbox existence or ownership.
Optional phone inputs are empty without an example placeholder, including
before the country picker loads and after changing country. Saved real numbers
still prefill normally. The canonical rule for all public front contact forms
is `common/.cursor/rules/front-form-contact-controls.mdc`.
