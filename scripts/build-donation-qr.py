"""Render the decoded homepage Venmo QR matrix as a crisp lossless PNG."""
import hashlib
import json
from pathlib import Path
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parents[1]
source = json.loads((root / 'src/donation-qr.json').read_text())
url = json.loads((root / 'src/content.json').read_text())['donation']['url']
if hashlib.sha256(url.encode()).hexdigest() != source['payloadSha256']:
    raise ValueError('Donation URL changed; decode and verify a matching QR before rendering.')
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
for destination in ['assets/originals/generated/gage-county-gop-venmo-qr.png',
                    'assets/web/brand/gage-county-gop-venmo-qr.png']:
    output = root / destination
    output.parent.mkdir(parents=True, exist_ok=True)
    image.save(output, optimize=True)
print('Rendered donation QR with its original payload and a four-module quiet zone.')
