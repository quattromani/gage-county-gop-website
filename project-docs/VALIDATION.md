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
