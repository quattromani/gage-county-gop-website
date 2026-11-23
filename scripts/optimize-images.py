"""Generate registered web derivatives without changing archived originals."""
import hashlib
import json
import shutil
from pathlib import Path
from PIL import Image, ImageOps

root = Path(__file__).resolve().parents[1]
registry = json.loads((root / 'src/assets.json').read_text())
for asset in registry['assets']:
    source = root / asset['sourcePath']
    if hashlib.sha256(source.read_bytes()).hexdigest() != asset['sourceSha256']:
        raise ValueError(f"Source changed; review provenance before regenerating: {source}")
    if asset.get('generator'):
        # Precise source-map derivatives have a dedicated preparation process.
        print(f"Use {asset['generator']} for {asset['id']}")
        continue
    output = root / asset['webPath']
    output.parent.mkdir(parents=True, exist_ok=True)
    if source.suffix.lower() == '.svg':
        # Keep approved native vector artwork sharp and byte-identical.
        shutil.copyfile(source, output)
        continue
    with Image.open(source) as original:
        display = ImageOps.exif_transpose(original).convert('RGB')
        display.thumbnail((1800, 1800))
        if output.suffix.lower() == '.png':
            display.save(output, optimize=True)
        else:
            display.save(output, quality=85, method=6)
print(f"Generated {len(registry['assets'])} registered assets checked. Dedicated derivatives retain their preparation process.")
