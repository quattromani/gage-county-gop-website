# Gage County GOP project guidance

This repository owns GOP publications, artwork and their presentation code. Use the repository-first knowledge and design principles in the parent workspace guidance. Keep consequential design decisions in project-docs.

The 2026 election snapshot is imported from Local Civic Reference. Correct candidate facts there, then use scripts/import-civic-reference.mjs. Never use the Gage County GOP website as a candidate authority; the user reported known errors. Never infer endorsements from inclusion. Preserve source dates and uncertainty.

Edit src/ and scripts/, then build public/; never edit generated HTML directly. PDFs and the long image are checked-in publication artifacts under output/pdf. Preserve original user artwork and prompt provenance. The current courthouse sticker is an image-generated adaptation of the supplied illustration; scripts/build-gop-sticker.py creates only the retired badge.

Run npm run check before release. Maintain relative links, scoped offline caching, noninteractive candidate ovals, accurate calendar media types and file sharing that sends only the sticker. Never claim a share-sheet handoff means a social post was published.

GitHub Pages is the current host. The intended domain is vote.gagecountygop.org. Do not reinstate Sites publishing or copy old Sites DNS records from the historical notes. Current migration and DNS instructions are in project-docs/HOSTING.md. Keep the future GOP projects independent of the neutral civic site's deployment.
