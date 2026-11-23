"""Prepare the verified donation QR, preserving supplied artwork when selected."""
import hashlib
import json
from pathlib import Path
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parents[1]
donation = json.loads((root / 'src/content.json').read_text())['donation']
source = json.loads((root / donation.get('qrSource', 'src/donation-qr.json')).read_text())
url = donation['url']
assets = json.loads((root / 'src/assets.json').read_text())['assets']
asset = next(item for item in assets if item['id'] == donation['qrAsset'])
if hashlib.sha256(url.encode()).hexdigest() != source['payloadSha256']:
    raise ValueError('Donation URL changed; decode and verify a matching QR before rendering.')
if source.get('kind') == 'supplied-artwork':
    if source['assetId'] != donation['qrAsset']:
        raise ValueError('Verified artwork does not match the selected donation asset.')
    original = root / asset['sourcePath']
    if hashlib.sha256(original.read_bytes()).hexdigest() != asset['sourceSha256']:
        raise ValueError('Supplied artwork changed; decode and verify it before replacing the source.')
    output = root / asset['webPath']
    output.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(original) as artwork:
        display = artwork.copy()
        edge = asset.get('displayMaxWidth', 640)
        display.thumbnail((edge, edge), Image.Resampling.LANCZOS)
        display.save(output, optimize=True)
    print('Prepared the supplied QR display image; its full-size source is unchanged.')
    raise SystemExit(0)
rows = source['rows']
size, scale, quiet = len(rows), 10, 4
assert all(len(row) == size and set(row) <= {'0', '1'} for row in rows)
image = Image.new('RGB', ((size + 2 * quiet) * scale,) * 2, 'white')
draw = ImageDraw.Draw(image)
for y, row in enumerate(rows):
    for x, module in enumerate(row):
        if module == '1':
            left, top = (x + quiet) * scale, (y + quiet) * scale
            draw.rectangle((left, top, left + scale - 1, top + scale - 1), fill='black')
for destination in [asset['sourcePath'], asset['webPath']]:
    output = root / destination
    output.parent.mkdir(parents=True, exist_ok=True)
    image.save(output, optimize=True)
print('Rendered donation QR with its verified payload and a four-module quiet zone.')
