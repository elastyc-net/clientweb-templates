# Responsive Help Desk search

`help-desk@1.3.12` keeps search visible above the request cards on desktop
(widths greater than 720px). Its X clears the query and keeps focus in the input.
On mobile, search starts as a magnifier button and opens/closes the same input.
Resizing preserves an active query and shows its input on mobile. No focus is
forced into search when the page loads or the viewport changes.

Only the component stylesheet and script changed. HTML, settings, providers,
Messenger and older immutable packages remain identical. The desktop CSS also
shows the input before JavaScript initializes, preventing a flash of the mobile
magnifier on a wide screen.

Elastyc.net receives a scoped immutable Candidate derived from the current
Production release. The existing revision check, private backup, hashed assets
and WorkspaceProductionPublisher flow preserve unrelated page content and the
separate Home/Contact publications. This direct component save does not advance
the tenant's library receipt. The operator proof is retained under
`{DataDir}/operations/help-desk-search-responsive-20261122`.

Validation: complete library/bundle checks, JavaScript syntax and engine
component contract validation, desktop/mobile saved-Draft review and Candidate asset verification, followed
by live Production B2B review. Direct Candidate rendering initially required
a renewed B2B session; no access policy was changed. See `delivery.json` for the published release and results.
