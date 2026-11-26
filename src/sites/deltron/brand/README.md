# Deltron brand profile 1.0.0

Starting point for all new Deltron Webfront work. Original client ZIP and fully extracted package stay local beside the chat attachment; `profile.json` records provenance and normalized light/dark tokens. This is an internal profile version, not a claim of new client sign-off.

`node build.mjs` verifies selected assets and generates `brand.css` and `theme.json` from the same profile. `theme.json` maps supported basics to the standard engine v2 theme; deployment merges it into the existing site-config and preserves the current favicon. Native Deltron layout adds generated brand CSS followed by tenant-local recipe CSS. Never install the supplied React bundle into the shared component library.

Only the two listed pure-vector logos and normalized profile/recipes are distributed. Original ZIP/MD/PDF, React bundle, previews, partner images and packaged font files stay local. `source/` and WOFF2 files are excluded by `.gitignore`. The brand directory is HTTP-denied by `web.config`; selected logos alone get a versioned Deltron docs path. Source SVG elements/attributes and styles were inspected for active/external content before selection.

## Decisions

Digital MD governs conflicting bundle defaults. Per user instruction, Ubuntu uses standard Webfront Google Fonts settings (`bodyGoogleFamily` and `headingGoogleFamily`), not supplied local WOFF2 files or a CSS @import. The engine handles fetching/caching. UI weights are 400/500; no synthetic 600. Semantic page/card/control colors support dark mode; solid primary fill stays #0055B8 with white text. Missing surface tokens are normalized. Shadows follow supplied digital CSS. Form controls adapt the existing native recipe (48px inputs, 44px actions, native 18px checkbox with 44px label target). Croatian UI; legacy home remains untouched.

No partner logos, sidebar filtering, gradients or glass are introduced. Azuri asset, additional blue logo variants, partner filtering exception and gradient policy remain open only if a future design needs them. No favicon was supplied, so retain the existing one.

## Agent and MCP context

Read this file and `profile.json` before editing Deltron. Scoped Cursor rule and nested AGENTS.md make the source discoverable to coding agents. Standard CMS/MCP sees supported site-config theme values; automatic delivery of the full private guidelines through every MCP is a separate engine capability, not provided by attaching files to chat. Keep the profile and version in every future Deltron handoff.

Local verification before font-source change: source/8 selected assets matched SHA-256; engine theme v2 and all 7 native definitions validate. Main text, links and primary action meet 4.5:1 in both palettes. Local browser checked 390px mobile without horizontal overflow, 48px fields, both loaded logo variants, theme persistence and first-line checkbox alignment. No real submission or external email was sent. Server Candidate verification remains to be completed. User narrowed distribution to selected required files on 2026-11-26; original documents remain local.
