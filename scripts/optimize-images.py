"""Make display derivatives; preserve all downloaded originals unchanged."""
from PIL import Image, ImageOps
from pathlib import Path
root=Path(__file__).resolve().parents[1]
out=root/'assets/web';out.mkdir(exist_ok=True)
for p in (root/'assets/originals').iterdir():
    with Image.open(p) as im:
        im=ImageOps.exif_transpose(im).convert('RGB')
        im.thumbnail((1800,1800))
        im.save(out/(p.stem+'.webp'),quality=85,method=6)
