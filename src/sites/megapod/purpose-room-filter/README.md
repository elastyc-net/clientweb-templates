# Megapod purpose-specific room finder

Tenant-only JavaScript for `tree-megapod` → `megapod-home-finder`, public route `/megapod`.
Replace only this instance’s `customCode.js` through the saved CMS Draft, build Candidate,
verify, then publish. Preserve every other instance, custom HTML/CSS, page setting and route.
The legacy `/` and `index.php` remain independently served.

Room lists curate the existing `Tip prostorije` values for each purpose. Only values with
positive counts in the current purpose/room/color result are shown. Mixed-use products stay
eligible for either purpose. The unchanged provider query and catalogue link intersect
`Namena`, selected `Tip prostorije` and `Boja`; empty room selection keeps all purpose results.
Home currently exposes Stambeni prostor, Dečija soba and Terasa. Existing Hodnik, Kuhinja,
Trpezarija and Garaza can appear for home only after matching products have home purpose.
Commercial excludes Stambeni prostor, Dečija soba, Hodnik, Kuhinja and Trpezarija.

Purpose changes clear the prior room/color options immediately, controls are disabled while
counts load, and sequence checks ignore stale responses. Errors retain a working catalogue link.
No PIM data, provider, package, product card, gallery component or shared site chrome changes.

Run `NODE_PATH=<jsdom-directory> node src/sites/megapod/purpose-room-filter/test.cjs`.
