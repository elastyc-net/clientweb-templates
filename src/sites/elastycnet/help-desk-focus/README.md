# Help Desk — Razgovor u fokusu

`help-desk@1.3.13` opts into the shared CaseMessenger focus surface. It keeps the
list, search and facets unchanged. The conversation has one compact title row,
information and close icons, a bounded history and one composer bar with attach,
auto-growing text (up to 128 px), speech dictation and icon-only send. On mobile
the host's existing full-screen dialog and central viewport adapter own geometry.
Details move to the existing accessible sheet without losing the message draft.

The standard Elastyc.net reply profile now advertises one attachment per message:
TXT, PDF, PNG, JPEG, DOCX or XLSX, up to 5 MiB. Multipart captures the same trusted
PHP upload inside Request; the existing session, CSRF, open-case and participant
checks remain. Native `_docs` and public `_el_commentIt` associations are written
inside the reply transaction, with a request hash including the attachment.
Failures remove the owned file; retries reuse the original message/file receipt.
Images receive Main-compatible thumbnails. No schema migration was required.
The existing Sendmail worker, notifications and Main composer were preserved.

Delivery used the versioned Common sync and GitHub Actions `help-desk-focus`
Plan/Apply overlay (four runtime files) at the same reviewed SHA. A scoped
Candidate derived from the active Production release changed only the Help Desk
component CSS/JS on `/help-desk` and `/en/help-desk`. It retained page access and
the independent Home/Contact publications. Standard WorkspaceProductionPublisher
activated the browser-reviewed Candidate. This direct component save did not
advance the tenant's library installation receipt. Private operator proofs:
`{DataDir}/operations/help-desk-focus-20261122`.

Validation: all 107 Webfront PHP test files and agent regression tests passed;
Common communication scope (37 checks), viewport (69 checks) and immutable library
checks passed. Candidate was reviewed at desktop and 390×844 mobile with the B2B
account, including a six-line draft, details/focus preservation, attachment
selection/removal, and Web Speech start/listening/stop. Actual spoken transcription
was not exercised. Existing DOCX download and the production synthetic TXT download
were verified. One message on isolated #26S01000930 was persisted and visible in
Main, with the same native attachment. Its worker finished with Messenger index
ready and push transport accepted for three registrations. Phone receipt is not
inferred from transport acceptance. See `delivery.json` for exact identities.
