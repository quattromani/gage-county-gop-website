# Gage County GOP website revision

A standalone review revision of the county party's Squarespace website, with its public content preserved and the existing 2026 voter-card publication imported.

- Preview: https://quattromani.github.io/gage-county-gop-website/
- Source website: https://www.gagecountygop.org/
- Party Reveal: https://partyreveal.com/

## Work locally

Use Node 22 or later. The site has no runtime or build package dependencies.

```sh
npm run check
python3 -m http.server 4187 --directory dist
```

Open http://localhost:4187/. The build produces static HTML in dist/. GitHub Actions runs the same checks and publishes that directory through Pages. Configure Settings → Pages → Source → GitHub Actions. No custom domain is assigned.

## Source ownership

| Location | Responsibility |
| --- | --- |
| src/content.json | Shared public contact, leadership, homepage links, and meeting schedule/overrides |
| src/participation.json | Owner-supplied committee teams and general descriptions |
| src/policies.json | Privacy/accessibility wording, links, and review date |
| src/contact-intake.json | Public submission endpoint and notice wording version; no private contact records |
| services/contact-intake/ | Append-only Google Apps Script service and deployment runbook |
| src/meeting.mjs | Shared occurrence, dated notice, and calendar model |
| src/assets.json | Stable descriptive asset IDs, titles, source checksums, display paths, and legacy aliases |
| src/constitution.json | Clause-level transcription of the five original constitution scans, with source-page paths |
| source-snapshot/inventory.json | Extracted original text, URLs, asset provenance, and capture date |
| source-snapshot/*.html | Unaltered public source pages, retained as historical evidence |
| assets/originals/ | Preserved captured media and descriptively named user-supplied originals |
| assets/web/ | Descriptively named display derivatives grouped by subject; originals remain unchanged |
| scripts/build.mjs | Semantic page composition and voter-card integration |
| src/style.css | Design tokens, layouts, and responsive patterns |
| src/site.js | Meeting refresh, document disclosures/scrollspy, menu and government-map interactions |
| vendor/voter-card/ | Imported publication source and required rendered downloads |
| project-docs/ | Brief, source review, import manifest, and verification |

The captured source contains conflicting and outdated material. The repository archive identifies that status and is excluded from the public build. Its donation template and generic testimonials are migration evidence, not current party claims. Current candidate facts belong in Local Civic Reference, flow through the existing GOP publication, and are then imported here. Inclusion is not endorsement.

## Party documents

The platform at `platform.html` renders the captured public wording from `source-snapshot/inventory.json`. The constitution at `constitution.html` renders `src/constitution.json` as navigable text and links to all five unchanged original scans below it. The scan's registered address is blacked out; the transcription explicitly marks that redaction and does not infer the hidden text. Review the scans when updating the transcription, preserving the source's spelling, punctuation, capitalization, and substantive wording. The page layout and clause grouping may change without changing that wording.

## Voter-card import

The imported source was captured from the current local gage-county-gop working tree on October 26, 2026, including uncommitted changes. VOTER-CARD-IMPORT.json records the parent commit and exact imported hashes. Its output includes 83 candidate listings, judicial retention questions, five calendar events, PDF/image downloads, a sticker, and offline saving.

The only publication-source adaptation is its preview base URL. The website build adds a return link and Party Reveal navigation, noindex metadata, and a new cache fingerprint to the generated card. The original publication project and deployment are untouched. Only /vote-2026/ has an offline worker.

To refresh, first complete and validate candidate/artifact changes in the original project. Copy the required src/ tree, build-gop-web-card.mjs, relevant output/pdf downloads, and provenance into vendor/voter-card. Record upstream status and file hashes, then retain the preview publicBaseUrl in publication.json. Run npm run check and inspect the published card. Avoid maintaining candidate corrections in this copy.

## Refresh the public archive

scripts/capture.py uses Python's standard library to capture the public sitemap, linked pages, and content media. Running it makes live network requests and overwrites the dated snapshot, so preserve the previous capture in Git first. Inspect changes before rebuilding. Register new assets in src/assets.json after reviewing the capture. scripts/optimize-images.py requires Pillow and regenerates the registered WebP derivatives. See [asset naming and provenance](project-docs/ASSET-NAMING.md) for the convention and examples. Image derivatives are committed, so normal builds need only Node.

## Rights and private data

Public availability does not establish a new license. Original media and text retain their owners' rights. No blanket license is assigned to source media or imported publications. This repository contains public-site material, not Squarespace private drafts, submissions, billing, credentials, or original layered design files. See project-docs/CONTENT-REVIEW.md for the remaining content-owner questions.

## Hosting and recovery

Changes on main trigger a checked Pages release. Failed checks prevent deployment. Recover by reverting the responsible source commit and pushing; do not edit dist/. A custom domain or replacement of Squarespace is a separate decision. Preview pages are public with noindex metadata; they are not access-controlled.

## Public review version

The source archive and archival-only media remain in Git, but archive.html and source-snapshot files are not published. The public website has no archive links, old-site navigation, migration caveats, or redesign banner. Candidate sourcing remains visible because it supports the election reference. The user confirmed meetings on the second Tuesday of each month at 7 p.m. Central at 402 Sports Bar & Grill, starting with December 8, 2026. The schedule is maintained in src/content.json and rendered on Home and Events. The single-event link advances after meeting day in Central time; Add monthly meetings imports a recurring series with dated exceptions. Imported calendar events do not receive later website corrections automatically. Governance procedure details defer to the constitution rather than repeating contradictory historical summaries.

## Participation and important notices

Navigation and homepage ordering prioritize attending, helping, and keeping contact details current. The Get involved page uses the seven teams supplied by the owner. Party organization remains in Resources alongside the documents and local-government guide. The custom on-site form handles add/update/stop requests and optional committee inquiries, using a full-screen phone layout and desktop dialog. Autofill is enabled for name, email, mobile and town. Requests go through an append-only Apps Script endpoint into the private Incoming requests tab for manual review; the website contains no private roster. Sending remains manual. See [contact and meeting operations](project-docs/CONTACT-AND-MEETING-OPERATIONS.md) for ownership, review, suppression, dated meeting changes, and calendar limits.

## Executive preview readiness

Privacy and Accessibility are linked from the secondary footer alongside Local government and Contact. Their wording reflects actual service use and known limits. See [November 21 preview readiness](project-docs/EXECUTIVE-PREVIEW-READINESS-2026-11-21.md) for the tested artifact, responsive/automated accessibility evidence, and remaining official-launch work. The review is local; it does not deploy a new Pages release or replace Squarespace.

## Logo comparison and 2026 homepage references

The compact homepage 2026 reference block follows Donate and uses `homeElectionReferences` in `src/content.json`. The voter card opens on the internal route; PartyReveal opens a new tab. After a regular build, `npm run preview:brand` creates a local-only masthead proof of revised B, a rounded R badge using the original logo’s colors. Ordinary builds remove that review overlay; the selected left-aligned partial R is applied to the website header, footer, and favicon. See [November 23 team feedback](project-docs/TEAM-FEEDBACK-2026-11-23.md).

The shared theme currently uses logo blue with the prior muted red (`brand.palette: "logo-blue"`); `original` restores the previous blue. `python3 scripts/build-donation-qr.py` prepares the checked 640px QR display derivative from its preserved full-size artwork (requires Pillow). The selected artwork and campaign payload verification live in `src/donation-qr-givebutter-supplied.json` and the asset registry.
