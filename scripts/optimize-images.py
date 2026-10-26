"""Generate registered web derivatives without changing archived originals."""
import hashlib
import json
from pathlib import Path
from PIL import Image, ImageOps

root = Path(__file__).resolve().parents[1]
registry = json.loads((root / 'src/assets.json').read_text())
for asset in registry['assets']:
    source = root / asset['sourcePath']
    if hashlib.sha256(source.read_bytes()).hexdigest() != asset['sourceSha256']:
        raise ValueError(f"Source changed; review provenance before regenerating: {source}")
    output = root / asset['webPath']
    output.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as original:
        display = ImageOps.exif_transpose(original).convert('RGB')
        display.thumbnail((1800, 1800))
        display.save(output, quality=85, method=6)
print(f"Generated {len(registry['assets'])} registered display images.")
