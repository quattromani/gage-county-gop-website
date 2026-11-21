# Government guide working brief

## Purpose and scope

Create government.html as a standalone reference page. Help Gage County residents understand state representation and county responsibilities and choose an appropriate office. Cover Legislative District 30, seven county supervisor districts, the eight countywide elected offices, and supporting county services. Exclude municipal governments, political affiliations, election endorsements, and a complete state-government organization chart.

The visual map will group related responsibilities rather than show a corporate reporting chain. District 30 is a seat within the Legislature. County supervisors and countywide elected offices appear side by side. Service links do not imply a uniform appointment or supervisory relationship. Use the existing site typography, ink, paper, and red accents; reinforce categories with headings and labels. Stack groups on narrow screens; keep useful information in ordinary semantic HTML with no diagram-library dependency. Five words: local, neutral, legible, connected, practical.

Readers may arrive with an office name, a service question, or no knowledge of government structure. The county department directory is the factual precedent (comprehensive, fragmented); the Legislature's senator page is the contact precedent (direct, official). This page should shorten the path between those sources and a resident's question. It is an occasional-use civic reference on a party-hosted site; party membership is irrelevant to its content.

## Knowledge and provenance

Maintain entities, people, office memberships, service routes, contacts, source IDs, source-check date, and uncertainties in src/government.json, independently of scripts/components/government-page.mjs and CSS. The existing Local Civic Reference dataset models candidacies, not verified current officeholding; do not infer current officeholders from it or alter it within this page task. This directory can later be imported into a shared government registry without extracting facts from HTML. No changes to the Assessment Knowledge Core or accepted legal reasoning are part of this civic presentation task.

Official county department pages and the Legislature's District 30 page supply listed officeholders and contacts. Distinguish the directory's checked date from a guarantee that each publisher has updated its page. Do not substitute 2026 winners before their service is confirmed. Keep legal text separate from plain-language task summaries. Source links remain visible in each section/card.

## Acceptance

- Standalone page, promoted through a homepage resource bar and footer link; omitted from header navigation.
- State representation and county services shown as parallel routes; county elected offices not drawn as subordinates of the board.
- All seven supervisor districts and eight countywide offices represented, with official names and contact links.
- County Clerk and Election Commissioner combined in one office card; District Court Clerk distinct from County Clerk.
- Supporting services and official rural/Beatrice supervisor maps linked; cities and villages excluded.
- Date and publisher limitations visible; service summaries source-backed; no affiliation data.
- Native anchors and links, keyboard focus, readable mobile layout, print support, and appropriate automated checks.

## Research notes, November 20, 2026

The county directory lists Patricia Milligan as Assessor, Amanda Fanning as County Attorney, Dawn Hill as Clerk/Election Commissioner, Donna Munoz as Register of Deeds, Laurie Wollenburg as Treasurer, Phyllis Schoen as District Court Clerk, Millard “Gus” Gustafson as Sheriff, and Chris Witulski as Surveyor. The Legislature lists Myron Dorn for District 30. These are official-site listings; no assumption about subsequent appointments or incoming terms is made.

The attorney page has inconsistent email text (a county mailbox with an older roger@gcaone.us parenthetical). Use the phone and official office-page link; omit the ambiguous email. The county homepage has generic “Commissioners” wording, while the actual county board page identifies supervisors and seven districts; use the board page. Map PDFs may carry older names, so link them for boundaries and use the current board directory for names. County Extension page returned 503; use the University of Nebraska Extension's Gage County page. Roads and Bridges explicitly distinguishes county-maintained roads from state, municipal, and other roads; avoid promising county coverage for every road. School, NRD, township, judicial, and municipal governing bodies are outside this first page's scope.

Neb. Rev. Stat. 23-1111 supports the distinction between county-board budget approval and individual county officers' staffing responsibilities. Use a brief source-linked explanation, not a general legal opinion about every supervisory relationship. No legal conclusions are being promoted to operational Core knowledge.

## Verification

All 14 automated checks passed after adding the guide, including every local anchor, source/office reference, all seven supervisor districts, eight office entries, telephone/email targets, source dates, and the absence of incoming government.html links. The existing local-link checker now recognizes tel: links. Desktop review at 1280px confirmed the two parallel map lanes and navigation from the map to an office. At 390px, the document width remained 390px, offices stacked into one column, and contacts wrapped within their cards. Narrow-screen connector lines are suppressed to avoid suggesting a reporting relationship between stacked lanes. Print rules preserve readable groups; a printed output has not been manually reviewed. External officeholder names are publisher listings, not independently certified appointment/term records.

The closing review found no new global convention to adopt. The parallel responsibility map and limited scope are local to this guide. Header and footer navigation are unchanged. The page is prepared in the local preview; it has not been committed or published.

## Homepage and footer access

The user approved a compact, full-width homepage reference bar between the meeting section and Donate, plus “Local government” in footer navigation. Keep the header focused on party information. The bar asks “Looking for local government information?” and offers “Explore the guide,” with a brief description. Its editorial copy is maintained in src/content.json. It reuses the soft background and typography of the quick-access cards and stacks at narrow widths. This supersedes the initial unlinked-review status and the earlier no-incoming-links validation criterion.


## Interactive supervisor geography

The user requested removal of the board-agendas link from the supervisor section and interactive maps linking geographic areas to the corresponding current supervisor. The countywide overview and Beatrice detail share district identifiers with the current directory model; the user confirmed that the downloaded map keys contain outdated officeholders and must be ignored. Use map geography only. Do not substitute municipal wards for supervisor districts: Beatrice Ward 3 is split between county districts 2 and 7.

Source PDFs were downloaded directly from the official county board page and preserved byte-for-byte in assets/originals/external, with SHA-256 provenance in src/assets.json. Their PDF-embedded image layers are the geographic reference. The public Gworks assessor service exposed parcels and roads but no supervisor-district layer; the city ArcGIS ward service describes municipal wards and cannot supply the county split. No GIS-coordinate or address accuracy is claimed.

The proportional design uses the existing paper, ink and red palette. A county view and a city-detail view sit beside a current-contact panel on desktop and stack on mobile. Geography is independently reusable image-space rings in src/supervisor-maps.json. Ordinary SVG links remain usable without scripts, and the supervisor list remains in semantic HTML. Runtime map interaction requires no third-party service or geolocation. The optional offline scripts/prepare-supervisor-maps.py uses Pillow and Poppler to prepare the geometry and source-map derivatives; normal npm builds consume checked-in outputs.

Acceptance: each of seven districts selects its correct current directory contact; map hover/focus previews and click/Enter/tap pins; selected supervisor cards receive a distinct outline/background; Beatrice can be opened from the county footprint or view control; zoom retains clickable geography; the printed keys are omitted; official PDF links remain for boundary checks. The geography is an overview traced from scans, with boundaries limited by source stroke widths and raster resolution.

Validation of this increment: all 15 npm checks passed, including source hashes, geographic interior samples for both maps, links, and joins to current supervisor records. Browser checks confirmed county District 3 → Erich Tiemann, Beatrice District 4 → Rick Clabaugh, and keyboard selection of District 6 → Rex Adams. At 390px the page remained 390px wide and selection brought the contact panel into view. The map is an SVG interaction over a prepared source-map base, not a cadastral GIS reconstruction; trace precision remains limited by the PDFs. No commit or public deployment was performed.

The shared document sidebar now tracks linked sections on both Constitution and Platform. Its reading line includes root scroll padding and each destination's scroll margin; this corrected Constitution's extra 28px inset. Browser checks confirmed Article III and the platform Economic Development section underlined on desktop, and no active underline at 390px. This is the project-wide sidebar behavior explicitly requested by the user.


The user requested full-height responsive maps after review: the default map fits its column width and grows the document vertically at its original aspect ratio, with no internal vertical scrollbar on desktop or mobile. Optional zoom retains horizontal scrolling and also grows the map’s full height. The desktop masthead flag now sits after the logo/wordmark, before navigation; the final navigation link aligns with the header’s right padding.

Layout follow-up verification: 15 checks passed. At 1280px the final header link ended at x=1216, exactly the header’s padded content edge; the flag began 30px after the wordmark. The county map’s client/scroll heights both measured 955px on desktop and 510px at 390px width. The Beatrice map measured 462px at 390px width; at 150% zoom both heights were 694px, with horizontal overflow only. Mobile page width remained 390px and the flag stayed hidden. No public deployment was performed.
