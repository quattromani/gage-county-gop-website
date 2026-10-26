# Gage County GOP website redesign

This is a standalone review revision of gagecountygop.org, separate from the election publication repository. Follow parent guidance. Authored presentation lives in src/ and scripts/; dist/ is generated.

Public source evidence lives in source-snapshot/ and assets/originals/. Preserve provenance and original wording in the archive. Do not treat historical candidate listings as current authority, infer endorsements, or publish donation template filler as genuine testimony. Site content is in src/content.json; imported source text remains in the inventory.

The voter card is a documented snapshot of ../gage-county-gop, including its uncommitted source at import. Candidate corrections belong in Local Civic Reference and the publication project, then resync. Never scrape candidate facts from the old party site into the card. Keep the card's service worker scoped to vote-2026/ and preserve relative links, judicial qualifications, calendars, and downloads.

Build and check with npm run check. GitHub Pages publishes dist/ from main. This is a public design preview with no custom domain; do not change the existing Squarespace site, DNS, or original voter-card deployment.
