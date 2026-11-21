from PIL import Image, ImageDraw, ImageFilter, ImageOps, ImageChops
from collections import deque, defaultdict
import json, hashlib, subprocess, tempfile
from pathlib import Path
root=Path(__file__).resolve().parents[1]
# Offline preparation only. Normal site builds consume checked-in derivatives.
# Requires Pillow and Poppler's pdfimages; no network or GIS service at runtime.
work=Path(tempfile.mkdtemp(prefix='gage-supervisor-maps-'))
for kind in ['rural', 'beatrice']:
    subprocess.run(['pdfimages','-png',str(root/'assets/originals/external'/f'gage-county-supervisor-districts-{kind}.pdf'),str(work/kind)],check=True)
Image.open(work/'beatrice-000.png').rotate(270,expand=True).save(work/'city-upright.png')
# Image-space geometry, not georeferenced parcel/GIS data. Source scans retained.
city=Image.open(work/'city-upright.png').convert('RGB')
# Remove printed keys, census table, publication title and logo from display only.
repairs=[((100,340,1350,620),(58,146,88),2),((1355,350,2095,775),(58,146,88),2),((150,2330,900,2770),(220,93,148),7),((100,2945,450,3068),(220,93,148),7)]
for box,color,_ in repairs:ImageDraw.Draw(city).rectangle(box,fill=color)
box=(100,340,2100,3060)
small=city.crop(box).resize((500,680),Image.Resampling.BOX).filter(ImageFilter.MedianFilter(3))
W,H=small.size
labels=[]
for r,g,b in small.getdata():
    label=0
    if max(r,g,b)-min(r,g,b)>38:
        if r>1.35*g and r>1.1*b:label=4 if g>b else 7
        elif g>1.4*r and g>b*.95:label=2 if g>1.4*b else 5
        elif b>1.13*g and b>1.4*r:label=3
    labels.append(label)
# Keep the main connected area of each district. Labels, roads and scanned ink are holes.
for label in [2,3,4,5,7]:
    seen=set(); comps=[]
    for i,v in enumerate(labels):
        if v!=label or i in seen:continue
        stack=[i];seen.add(i);comp=[]
        while stack:
            p=stack.pop();comp.append(p);x=p%W;y=p//W
            for q in ([p-1] if x else [])+([p+1] if x<W-1 else [])+([p-W] if y else [])+([p+W] if y<H-1 else []):
                if q not in seen and labels[q]==label:seen.add(q);stack.append(q)
        comps.append(comp)
    comps.sort(key=len,reverse=True)
    print('city',label,'areas', [len(c) for c in comps[:3]])
    for comp in comps[1:]:
        if len(comp) < 100:
            for p in comp:labels[p]=0
# Nearest-colour extension only repairs roads/text separating samples of the same region.
queue=deque(i for i,v in enumerate(labels) if v)
while queue:
    p=queue.popleft();x=p%W;y=p//W
    for q in ([p-1] if x else [])+([p+1] if x<W-1 else [])+([p-W] if y else [])+([p+W] if y<H-1 else []):
        if not labels[q]:labels[q]=labels[p];queue.append(q)
labelImage=Image.new('L',(W,H));labelImage.putdata(labels);labelImage=labelImage.filter(ImageFilter.ModeFilter(5));labels=list(labelImage.getdata())
# Trace pixel-edge rings; preserve all turns (4 source pixels per sample).
def polygons(label):
    edges=defaultdict(list)
    for y in range(H):
        for x in range(W):
            p=y*W+x
            if labels[p]!=label:continue
            if y==0 or labels[p-W]!=label:edges[(x,y)].append((x+1,y))
            if x==W-1 or labels[p+1]!=label:edges[(x+1,y)].append((x+1,y+1))
            if y==H-1 or labels[p+W]!=label:edges[(x+1,y+1)].append((x,y+1))
            if x==0 or labels[p-1]!=label:edges[(x,y+1)].append((x,y))
    rings=[]
    while edges:
        start=next(iter(edges));p=start;ring=[p]
        while True:
            q=edges[p].pop()
            if not edges[p]:del edges[p]
            if q==start:break
            ring.append(q);p=q
        # Drop collinear vertices; no smoothing of geographic turns.
        ring=[p for i,p in enumerate(ring) if (p[0]-ring[i-1][0])*(ring[(i+1)%len(ring)][1]-p[1])!=(p[1]-ring[i-1][1])*(ring[(i+1)%len(ring)][0]-p[0])]
        if len(ring)>3:rings.append(ring)
    return rings
cityDistricts=[{'district':d,'rings':polygons(d),'label':p} for d,p in [(2,[85,180]),(3,[400,560]),(4,[435,344]),(5,[300,300]),(7,[90,540])]]
# Rural boundary centreline control points read from the county's coloured scan.
# All rings use the same shared edges; Beatrice has a separate detailed view.
ruralRings={
1:[[418,318],[1056,310],[1067,934],[852,935],[850,752],[642,752],[640,536],[418,536]],
2:[[203,318],[418,318],[418,536],[640,536],[642,752],[635,934],[603,934],[596,860],[555,860],[552,821],[482,821],[480,900],[443,900],[441,938],[414,938],[414,1078],[202,1078]],
3:[[630,1010],[640,1010],[640,1185],[530,1185],[530,1078],[566,1078],[566,1045],[600,1045],[600,1010]],
6:[[642,752],[850,752],[852,935],[1067,934],[1074,1620],[640,1628],[640,1010],[635,934]],
7:[[202,1078],[414,1078],[414,1010],[440,1010],[440,1045],[480,1045],[480,1078],[530,1078],[530,1185],[640,1185],[640,1628],[208,1631]]}
# The grey city footprint is an inset link; it is not assigned a rural district.
cityFootprint=[[484,829],[552,829],[554,868],[582,868],[582,901],[603,901],[603,938],[635,938],[640,1010],[600,1010],[600,1045],[566,1045],[566,1078],[480,1078],[480,1045],[440,1045],[440,1010],[414,1010],[414,965],[443,965],[443,913],[484,913]]
rural=Image.open(work/'rural-000.png').convert('RGB')
def base(im,box,name):
    crop=im.crop(box);gray=ImageOps.grayscale(crop).convert('RGB');gray=Image.blend(gray,Image.new('RGB',gray.size,'white'),.18)
    if 'beatrice' in name:
        # Keep local street/label contrast while removing the scanned colour wash.
        diff=ImageChops.difference(gray,gray.filter(ImageFilter.GaussianBlur(5)))
        gray=diff.point(lambda x:255-min(165,max(0,x-5)*5))
    gray.save(root/'assets/web/places'/name,quality=90)
base(city,box,'gage-county-supervisor-map-beatrice.webp')
base(rural,(190,300,1090,1650),'gage-county-supervisor-map-rural.webp')
model={'schemaVersion':1,'coordinateSystem':'Source image pixels; not georeferenced','precisionNote':'Interactive overview traced from the county’s published maps. Check the official PDFs for locations close to a district boundary.','maps':[
{'id':'county','title':'Countywide','sourceId':'rural-map','assetId':'gage-county-supervisor-map-rural','viewBox':[190,300,900,1350],'districts':[{'district':d,'rings':[r],'label':p} for (d,r),p in zip(ruralRings.items(),[[860,510],[300,700],[590,1140],[865,1300],[360,1350]])],'detailLink':{'target':'beatrice','rings':[cityFootprint],'label':[525,971]}},
{'id':'beatrice','title':'Beatrice detail','sourceId':'beatrice-map','assetId':'gage-county-supervisor-map-beatrice','viewBox':[0,0,500,680],'districts':cityDistricts}
]}
(root/'src/supervisor-maps.json').write_text(json.dumps(model,ensure_ascii=False,indent=2)+'\n')
assets=json.loads((root/'src/assets.json').read_text())
for label,filename,sourceName,sid in [('rural','gage-county-supervisor-map-rural','gage-county-supervisor-districts-rural.pdf','rural-map'),('Beatrice','gage-county-supervisor-map-beatrice','gage-county-supervisor-districts-beatrice.pdf','beatrice-map')]:
    sourcePath='assets/originals/external/'+sourceName
    sources=json.loads((root/'src/government.json').read_text())['sources']
    assets['assets'] = [a for a in assets['assets'] if a['id'] != filename]
    assets['assets'].append({'id':filename,'title':'Gage County supervisor district map, '+label,'sourcePath':sourcePath,'sourceUrl':sources[sid]['url'],'sourceSha256':hashlib.sha256((root/sourcePath).read_bytes()).hexdigest(),'webPath':'assets/web/places/'+filename+'.webp','generator':'scripts/prepare-supervisor-maps.py','derivation':'Monochrome map crop; Beatrice linework isolated from colour wash. Beatrice title, census table and printed legend omitted. Interactive geometry in src/supervisor-maps.json; names come exclusively from src/government.json.'})
(root/'src/assets.json').write_text(json.dumps(assets,ensure_ascii=False,indent=2)+'\n')

# Generated temporary extracts are reproducible and are not archival sources.
import shutil
shutil.rmtree(work)
