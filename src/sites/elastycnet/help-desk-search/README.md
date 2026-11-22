# Help Desk search refinement

Delivered on Elastyc.net on 22 November 2026. Source is the immutable optional
`help-desk@1.3.11` package. Previous released versions remain unchanged.

The search action uses the shared Lucide search geometry and inherits the Help
Desk/site palette. The input has an inline magnifier, an integrated close action,
a focus ring, and space before the first request card. The mobile action remains
compact with a 44px touch target. Existing search handlers, filters, translations,
provider permissions and Messenger behavior are preserved.

The tenant component was saved with its expected Draft revision. A scoped
immutable Candidate was derived from the current Production release. Only the
Help Desk component HTML and stylesheet references on `/help-desk` and
`/en/help-desk` changed. Other page content, Home/Contact publications, assets,
routes and access rules were preserved. No full Draft publication or engine
installation was performed. The tenant's library receipt was not advanced by
this direct, reviewed component save.

Validation includes the complete library checksum/bundle verification, the
engine component contract validator, unchanged JavaScript syntax verification,
and desktop/mobile Candidate review. Production was activated through the
existing WorkspaceProductionPublisher after Candidate inspection. Live B2B
search verification and release identifiers are recorded in `delivery.json`.

The private IIS operation backup retains the baseline, reviewed component and
Candidate proof under `{DataDir}/operations/help-desk-search-20261122`.
