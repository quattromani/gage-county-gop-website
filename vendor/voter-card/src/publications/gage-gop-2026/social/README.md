# Social images

`preview.html` is the editable layout, composed with the existing GOP logo and the original, unmodified courthouse illustration. It contains no candidate facts. Render through a local static server and export a viewport PNG at device scale 1:

- No query: 1200 × 630 → `../assets/facebook-preview.png`
- `?square`: 1080 × 1080 → `../assets/facebook-post-square.png`

Wait for both source images to load before exporting. Inspect both formats, then run `npm run check`. Committed PNGs allow CI to publish without browser or design dependencies. The build derives an image version from its bytes for Open Graph cache invalidation.

The wide image is selected by static Open Graph metadata when sharing the voter-card URL. The square image is for direct photo uploads, with the card URL in the post caption. No automatic Facebook posting occurs. Facebook controls final presentation and may cache old previews. Use its Sharing Debugger to request a fresh scrape if needed: https://developers.facebook.com/tools/debug/ .

Design baseline: 1200 × 630 link image, supported by https://support.wix.com/en/article/wix-editor-recommended-ogimage-size . Meta's best-practices page returned HTTP 429 during verification on September 26, 2026. Facebook's live composer preview has not been tested.
