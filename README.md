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
| src/content.json | Shared contact, roster, and meeting data |
| src/assets.json | Stable descriptive asset IDs, titles, source checksums, display paths, and legacy aliases |
| source-snapshot/inventory.json | Extracted original text, URLs, asset provenance, and capture date |
| source-snapshot/*.html | Unaltered public source pages, retained as historical evidence |
| assets/originals/ | Preserved captured media and descriptively named user-supplied originals |
| assets/web/ | Descriptively named display derivatives grouped by subject; originals remain unchanged |
| scripts/build.mjs | Semantic page composition and voter-card integration |
| src/style.css | Design tokens, layouts, and responsive patterns |
| src/site.js | Optional archive filtering, source disclosure, and menu Escape behavior |
| vendor/voter-card/ | Imported publication source and required rendered downloads |
| project-docs/ | Brief, source review, import manifest, and verification |

The original site contains conflicting and outdated material. The archive identifies that status. Its donation template and generic testimonials are migration evidence, not current party claims. Current candidate facts belong in Local Civic Reference, flow through the existing GOP publication, and are then imported here. Inclusion is not endorsement.

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
