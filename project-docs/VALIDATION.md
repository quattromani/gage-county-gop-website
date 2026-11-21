# Preview verification

Target: public GitHub Pages design preview, repository quattromani/gage-county-gop-website. Reviewed October 26, 2026. This is a review revision, not a replacement of the production Squarespace site.

## Passed before release

- Node build and eight behavioral/integrity tests: all local links and anchors, source inventory and all 36 asset hashes, full platform and archive text preservation, document landmarks/alternatives, exact voter-card candidate inclusion, original download bytes and five calendar milestones, offline retrieval and scope boundaries, and archive filtering/direct-link behavior.
- Browser inspection of homepage and all substantive templates in the in-app Chromium browser. Phone-width checks at 390 CSS pixels found no horizontal overflow on homepage, about, events, resources, platform, contact, archive, or voter card. Desktop checks covered all pages. No broken images appeared in those page observations.
- Mobile menu opens and Escape closes it; archive browser search for Dennis returns four source pages. Source disclosures, explicit email destination, and Party Reveal/voter-card links were inspected.
- Voter-card CSS and behavior remain imported; return navigation is separate. Offline worker is scoped to vote-2026/ and its cache fingerprint includes the integration change.
- Public source pages, original assets, capture provenance, imported-publication hashes, local design decisions, and maintenance directions are in the repository. No remote font, analytics, payment widget, or form backend was added.
- Shared guidance and front-end launch checkpoint: no material divergence requiring a global guidance change. Uncertainty is modeled rather than silently resolved. Candidate corrections remain upstream.

## Limits and follow-up

- No full WCAG conformance claim: screen readers, real iOS/Android devices, other browser engines, automated axe coverage, and 200% text enlargement have not been fully exercised. Native controls, semantic HTML, focus styles, and narrow-screen reflow have targeted coverage.
- Constitution remains five source images, without a verified accessible transcription. Original event dates, meeting year, governance contradictions, contribution destination, current roster confirmation, and asset rights need owner review before official replacement.
- Card offline behavior has a service-worker harness test; full on-device offline installation and native calendar/share-app handoffs are not re-certified here. No calendar subscriptions, social posts, or donations were made.
- No field performance data or Core Web Vitals claim. The static build has no third-party runtime dependencies and uses locally optimized images, but no measured mobile-network budget is claimed.
- Private Squarespace drafts, submissions, account settings, and unpublished originals are outside this public capture.
- GitHub Pages controls response headers; the card's historical _headers file is preserved but Pages does not apply it. Verify calendar media types on the deployed host.

Public pages carry noindex metadata for review. This reduces unintended indexing; it does not make the preview private. No custom domain, DNS, original publication, or Squarespace changes are part of this release.

## Production verification

Deployment results and live-path checks are reported in the delivery conversation. The workflow runs these same eight checks before publishing dist/. Reverting source and pushing triggers a checked recovery release.

## Headshot and asset naming update, October 26, 2026

Replaced Max Quattromani’s leadership portrait with the user-supplied photo. Registered all 37 display images with stable descriptive IDs, human-readable titles, original checksums, and subject folders. All 36 previously published image paths are generated as compatibility aliases; archived originals and the voter-card import are unchanged.

The eight checks pass with expanded asset validation covering unique IDs and paths, naming rules, original checksums, capture coverage, and byte-identical compatibility aliases. Browser review confirmed the new portrait, title, alt text, and caption at desktop and 390-pixel phone width. Shared guidance checkpoint found no material divergence; the naming convention is local to this project as requested.

## Public review cleanup, October 26, 2026

User confirmed November 10, 2026, at 7 p.m. Removed source-capture, old-site, and redesign commentary from public pages; retained substantive election sourcing. Excluded archive.html and archival-only media from dist/ while retaining the full repository archive and original checksums. Public organization descriptions defer contested procedure details to the constitution. Build checks now verify archive exclusion and confirmed meeting rendering. Earlier archival and date limitations above describe the historical preview, not this revision.

## Meeting calendar action, October 26, 2026

Homepage, events, and contact meeting actions now use one generated .ics event for November 10, 2026, at 7 p.m. Central, at 402 Sports Bar & Grill, Beatrice, Nebraska. A ninth check verifies all three destinations, the exact UTC start, location escaping, CRLF encoding, line folding, and absence of a fabricated duration or attendees. Existing election calendars remain unchanged. No event was added to a personal calendar during verification.

## November 20, 2026 meeting recurrence update

The current meeting source starts December 8, 2026 and repeats on the second Tuesday of each month at 7 p.m. Central at 402 Sports Bar & Grill. Home and Events advance after the meeting date ends in America/Chicago; the Contact single-event link follows the same date. All three pages also offer an Add All recurring .ics series. `npm run check` passes 11 checks, including Central midnight, year rollover, daylight saving offsets, and the recurring calendar rule. The build provides an initial single-event file when JavaScript is unavailable; the future-date rollover requires JavaScript. A local browser preview could not run in this environment because port binding and file URLs were blocked. This work has not been published to GitHub Pages.

## November 20, 2026 party document transcription

The five original constitution PNGs were inspected page by page, with OCR used as a drafting aid and manual correction against the scans. The text is stored by article and clause in `src/constitution.json`; the source-page paths and unchanged bytes are checked during the build test. The first scan's address is visibly redacted, so the text marks that omission. The platform wording remains sourced from the captured inventory and now has an original-page link after the text. The local `constitution.html` page was reviewed in the browser for article navigation, reading order, and links to all five originals. `npm run check` passes 12 checks. This local change has not been published.

## Approved participation refactor, November 20, 2026

The owner approved the creative-direction recommendations, then supplied seven committee teams and requested the existing dark blue/red palette for the meeting strip. Implemented locally; no commit, push, live Squarespace/DNS edit, or Pages release performed.

- `npm run check`: 18 checks pass. New coverage includes canceled-date retention, venue/hour changes, moves earlier/later/across months, recurring exceptions with stable UIDs, Central midnight, DST and nonexistent local hours, invalid configurations, navigation/home ordering, intake routes, and private admin-ID/QA-data exclusion. Source text, asset hashes, voter-card inclusion/downloads and offline scope checks continue to pass.
- All 11 authored pages reviewed at 390×844, 768×1024, 1024×768 and 1440×900 CSS pixels. No horizontal document overflow or loaded broken-image elements found in those observations. Saved bounded layout results in `review/participation-refactor-2026-11-20/responsive-results.json`. Final blue strip and expanded committee content reviewed again on phone and desktop.
- Native Chrome browser zoom visibly set to 200%; Home, Updates, Events, Get involved, Resources, Constitution, Platform and Government reflowed without horizontal document overflow. Zoom reset afterward. This is browser zoom coverage, not a claim of full text-only enlargement or accessibility conformance.
- Mobile menu opens with an X, Escape closes it and returns focus, and clicked navigation links close it. Mobile topic disclosure opens, jumps to an article, and closes. Desktop Constitution article/current underline verified; Platform follows the same shared scrolling navigation.
- Public Google Form tested while signed out: one fictional `QA TEST` request submitted, accurate receipt-for-review confirmation shown, response observed in its linked private Sheet. No member records imported; Contacts remains empty. The single QA response remains explicitly marked and must not enter the roster. Mobile update/stop routes preselect their task; interest routes select reply-only. Candidate Survey link also prefilled the correct team.
- Private workbook and Form editor access verified separately as owner-only. Public responder access is distinct. Results summaries, response editing and the one-response account requirement are off. Owner notifications for new incoming requests are enabled. All three native workbook tabs visually inspected; Instructions title and response wrapping adjusted for readability. Workbook uses America/Chicago.
- Contact sending, register review, correction matching and suppression remain manual. Named executive-team/appointed-member Google accounts are still required before collaboration access can be granted. No membership, committee appointment, voter registration, email/text campaign or PWA is created by intake.

Limits: no real-device iOS/Android, other browser-engine, assistive-technology, delivery-provider, native calendar re-import or usability-study certification. Calendar downloads remain snapshots. No attendees, durations, workload commitments or unconfirmed committee vacancies are fabricated. See CONTACT-AND-MEETING-OPERATIONS.md for maintenance and operating ownership.

Final follow-up: all Google contact-form links now request a new tab with `noopener noreferrer`, accessible link labels, and an advance explanation. Verified a Candidate Survey interest link opened a separate Chrome tab while preserving the committee page, team field and reply-only choice. The in-app browser's automated popup inventory did not expose a new tab; the native Chrome handoff was confirmed. All 18 checks still pass.

## On-site form conversion, November 21, 2026

24 automated checks pass, including six new submission-service/client contracts. Signed-out phone-width inquiry successfully saved to Incoming requests and returned an on-site matching-ID receipt. No Google Forms navigation, account login, roster lookup or automatic contact modification is involved. New intake consent and deployment were explicitly approved by the owner at Google's permission checkpoint.

Manual form review: widths 320, 390, 768 and 1280; 16px autofill-compatible inputs; mobile full-screen layout; committee/reply-only preselection; validation summary/field links; retained values after failure; keyboard containment, Escape and focus return. Native autofill metadata was checked; physical-device autofill/keyboard behavior remains unverified. The selected Updates handoff sentence was removed. See ON-SITE-CONTACT-FORM.md for full evidence and operational limits.


## Executive preview and policy pages, November 21, 2026

Added structured Privacy and Accessibility pages and a secondary-only footer. All 24 build/service checks pass. axe-core 4.10.3 found zero reported violations across 13 pages, the 404 template, and open/validation dialog states after landmark and ARIA cleanup. Scanner manual contrast-review entries remain; no conformance certification is claimed. New policy pages and Home fit at five widths from 320px to 1280px; footer links measure 44px high. Mobile menu, committee preselection, footer policy routes, District 3 selection, and Treasurer question highlighting were exercised. Temporary audit/metrics tooling is excluded from the final artifact. See EXECUTIVE-PREVIEW-READINESS-2026-11-21.md and review/executive-preview-2026-11-21/ for scope, hashes, evidence, operational limits, and official-launch follow-ups. No release or domain change performed.
