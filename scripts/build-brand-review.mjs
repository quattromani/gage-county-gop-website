// Local identity review only; ordinary builds remove this overlay.
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const out = path.join(root, 'dist/_brand-review');
const home = fs.readFileSync(path.join(root, 'dist/index.html'), 'utf8');
const { assets } = JSON.parse(fs.readFileSync(path.join(root, 'src/assets.json')));
const content = JSON.parse(fs.readFileSync(path.join(root, 'src/content.json')));
const original = assets.find(asset => asset.id === 'republican-letter-r-artwork');
const selected = assets.find(asset => asset.id === content.brand.markAsset);
const mark = path.basename(selected.webPath);
fs.mkdirSync(out, { recursive: true });
fs.copyFileSync(path.join(root, original.sourcePath), path.join(out, 'original-r.png'));
fs.copyFileSync(path.join(root, selected.webPath), path.join(out, mark));
const header = home.match(/<header class="site-header">[\s\S]*?<\/header>/)[0]
  .replaceAll('href="./', 'href="../').replaceAll('src="./', 'src="../');
const palette = home.match(/data-palette="([^"]+)"/)?.[1] || 'original';
const cssVersion = home.match(/style\.css\?v=([a-f0-9]+)/)[1];
fs.writeFileSync(path.join(out, 'index.html'), `<!doctype html>
<html lang="en" data-palette="${palette}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Partial R, original colors | Gage County GOP</title><link rel="icon" href="./${mark}" type="image/svg+xml"><link rel="stylesheet" href="../style.css?v=${cssVersion}">
<style>
.review-intro{padding-block:32px}.review-intro h1{font-size:clamp(32px,4vw,42px)}.review-intro p{max-width:70ch}.review-scales{display:flex;align-items:center;flex-wrap:wrap;gap:28px;margin-block:24px}.review-scales figure{display:grid;justify-items:center;gap:10px}.review-scales figcaption{font:12px var(--sans);color:var(--muted)}.review-comparison{display:flex;align-items:start;flex-wrap:wrap;gap:40px;margin-block:32px}.review-comparison figure{display:grid;gap:12px;max-width:250px}.review-comparison img{width:128px;height:auto}.review-comparison figcaption{font:14px var(--sans)}.review-colors{font:14px var(--sans);color:var(--muted)}
</style></head><body><main>
<div class="wrap review-intro"><p class="eyebrow">Logo review / partial R</p><h1>The partial R, cleaned up.</h1><p>The original partial R, aligned left with equal spacing at the left, top, and bottom. Rounded corners and the original red and blue are preserved.</p></div>
${header}
<div class="wrap review-intro"><p class="eyebrow">At different sizes</p><div class="review-scales">${[16,32,64,128].map(size=>`<figure><img src="./${mark}" width="${size}" height="${size}" style="width:${size}px;height:${size}px" alt="Rounded partial R badge at ${size} pixels"><figcaption>${size}px</figcaption></figure>`).join('')}</div>
<div class="review-comparison"><figure><img src="./original-r.png" width="128" height="133" alt="Original red R with scratched blue-gray background"><figcaption>Existing artwork</figcaption></figure><figure><img src="./${mark}" width="128" height="128" alt="Proposed partial red R on a rounded blue badge"><figcaption>Partial R / rounded badge</figcaption></figure></div>
<p class="review-colors">Blue #3A4B5F · Red #F6001B</p><p>This is a comparison preview. The left-aligned partial R is now applied to the main website’s header, footer, and favicon for team review.</p><a href="../index.html#election-resources">Return to the homepage →</a></div>
</main></body></html>`);
console.log('Local logo proof: dist/_brand-review/ (excluded from ordinary builds).');
