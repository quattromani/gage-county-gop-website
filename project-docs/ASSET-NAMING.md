# Asset naming and provenance

This convention governs the standalone website. It replaces Squarespace-derived display filenames without rewriting the archived evidence or the imported voter card's published file contract.

## Review findings

The initial migration used names such as `a2bb5fb516-Max_Quattromani.webp`. The hash helped locate a source URL, but was poor editorial vocabulary. Spaces converted to repeated hyphens, mixed capitalization, misspellings, ambiguous years, and labels such as `pic1` also made the folder hard to browse. Page code referred to hash fragments rather than subjects.

The display collection now uses descriptive filenames in subject folders. The source register, `src/assets.json`, owns stable IDs, titles, source paths, source URLs or supplied filenames, SHA-256 checksums, and display paths. All 36 captured images and the new headshot are registered.

## Naming rules

Use `assets/web/<category>/<subject>[-<detail>].<format>`. Use WebP for photographic derivatives; PNG is supported for sourced flat graphics such as the masthead flag.

- Use lowercase ASCII letters, numbers, and single hyphens. Avoid spaces, underscores, personal device filenames, source hashes, `final`, `new`, and `copy`.
- Choose a category: `people`, `places`, `events`, `documents`, `brand`, or `archive`.
- Name the subject, then its purpose or distinguishing detail: `people/max-quattromani-headshot.webp` or `places/gage-county-courthouse-beatrice.webp`.
- Include a year or date only when supported by the source: `events/2025-10-county-gop-meeting.webp`. Keep uncertain dates in the register's description, not an invented filename date.
- Use two-digit sequence numbers for distinct related images or document pages: `2026-county-convention-01.webp` and `county-gop-constitution-2026-page-01.webp`.
- If a future derivative needs a distinct crop or size, append the actual role or width, such as `max-quattromani-headshot-square.webp` or `max-quattromani-headshot-640w.webp`. Create only derivatives the presentation needs.

An ID identifies the content asset and normally matches its filename stem. Code refers to that ID; it does not search for filename fragments. A human title describes the asset. Alt text describes its meaning in context; a title attribute is supplemental and never its replacement. Office titles belong in metadata and visible captions, so filenames need not change when roles change.

## Originals and compatibility

Captured originals keep their existing names and bytes under `assets/originals/`; their historical inventory remains unchanged. New user-supplied originals receive descriptive names under `assets/originals/user-supplied/`, with the supplied filename and checksum recorded in the register. The new portrait is titled “Max Quattromani, Vice Chair, Gage County GOP.” Its previous website portrait remains archived.

`legacyWebPath` generates an alias for previously published images retained in the public presentation. Archival-only media is excluded from the public build; its originals and registry entries remain in the repository. New markup uses the descriptive URL. Do not remove aliases merely to tidy the output folder. Imported voter-card files, source snapshots, downloads, icons, and offline paths retain their upstream names; changing those requires a separate compatibility review.

## Add or replace an asset

Preserve the original, register its provenance and descriptive display path, and generate the derivative with `scripts/optimize-images.py`. It verifies original checksums before processing. Update the relevant content ID, then run `npm run check` and inspect the image in its real layout. After refreshing the public capture, register new inventory assets before rebuilding. Never overwrite an original to hide a source change.
