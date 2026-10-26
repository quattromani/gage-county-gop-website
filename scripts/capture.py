"""Preserve public Squarespace pages and first-party content assets, with provenance."""
import concurrent.futures, hashlib, html, json, pathlib, re, time, urllib.request
from html.parser import HTMLParser
from urllib.parse import urljoin, urlsplit, unquote
import xml.etree.ElementTree as ET

ROOT = pathlib.Path(__file__).resolve().parents[1]
BASE = 'https://www.gagecountygop.org'
def fetch(url):
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (public website migration inventory)'})
            with urllib.request.urlopen(req, timeout=40) as response:
                return response.read()
        except Exception:
            if attempt == 2: raise
            time.sleep(1)

class Content(HTMLParser):
    def __init__(self):
        super().__init__(); self.main=False; self.skip=0; self.text=[]; self.links=[]; self.images=[]; self.title=[]; self.in_title=False
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag=='title': self.in_title=True
        if tag=='main': self.main=True
        if tag in ('script','style'): self.skip+=1
        if tag=='a' and a.get('href'): self.links.append(a['href'])
        if self.main and tag=='img':
            src=a.get('data-src') or a.get('src')
            if src: self.images.append({'url':html.unescape(src.split('?')[0]),'alt':a.get('alt','')})
        if self.main and tag in ('p','h1','h2','h3','li','br','figcaption'): self.text.append('\n')
    def handle_endtag(self,tag):
        if tag=='main': self.main=False
        if tag=='title': self.in_title=False
        if tag in ('script','style'): self.skip=max(0,self.skip-1)
        if self.main and tag in ('p','h1','h2','h3','li','figcaption'): self.text.append('\n')
    def handle_data(self,data):
        if self.in_title: self.title.append(data)
        if self.main and not self.skip: self.text.append(data)

def capture():
    snapshot=ROOT/'source-snapshot'; snapshot.mkdir(exist_ok=True)
    sitemap=fetch(BASE+'/sitemap.xml'); (snapshot/'sitemap.xml').write_bytes(sitemap)
    tree=ET.fromstring(sitemap)
    urls=[x.text for x in tree.findall('{*}url/{*}loc')]
    records=[]; seen=set(); queue=urls+[BASE+'/']
    while queue:
        url=queue.pop(0).split('?')[0].split('#')[0]
        if url in seen: continue
        seen.add(url); slug=urlsplit(url).path.strip('/') or 'root'
        if '/' in slug: continue
        try:
            raw=fetch(url); (snapshot/(slug+'.html')).write_bytes(raw)
            parser=Content(); parser.feed(raw.decode())
            lines=[re.sub(r'\s+',' ',line).strip() for line in ''.join(parser.text).split('\n')]
            record={'url':url,'slug':slug,'title':''.join(parser.title),'text':[x for x in lines if x], 'images':parser.images,'links':list(dict.fromkeys(urljoin(url,x) for x in parser.links))}
            records.append(record)
            for link in record['links']:
                if urlsplit(link).netloc=='www.gagecountygop.org' and not re.search(r'\.(png|jpg|pdf|jpeg|svg)$',link,re.I) and link not in seen: queue.append(link)
            print(slug, len(record['text']),len(record['images']),flush=True)
        except Exception as e: records.append({'url':url,'slug':slug,'error':str(e)})
    images={}
    for record in records:
        for img in record.get('images',[]): images.setdefault(img['url'],img)
    for node in tree.findall('.//{http://www.google.com/schemas/sitemap-image/1.1}loc'):
        images.setdefault(node.text,{'url':node.text,'alt':''})
    # Preserve public linked uploads too; platform runtime JS/CSS is not authored site content.
    for record in records:
        for link in record.get('links',[]):
            if re.search(r'\.(pdf|docx?|png|jpe?g)(\?|$)',link,re.I): images.setdefault(link,{'url':link,'alt':''})
    def asset(img):
        try:
            raw=fetch(img['url']); name=unquote(urlsplit(img['url']).path.rsplit('/',1)[-1]); name=re.sub(r'[^\w.\-]','-',name)
            name=hashlib.sha256(img['url'].encode()).hexdigest()[:10]+'-'+name
            if '.' not in name: name+='.jpg'
            path='assets/originals/'+name; (ROOT/path).write_bytes(raw)
            return {**img,'path':path,'bytes':len(raw),'sha256':hashlib.sha256(raw).hexdigest()}
        except Exception as e: return {**img,'error':str(e)}
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool: assets=list(pool.map(asset,images.values()))
    data={'source':BASE,'captured':'2026-10-26','scope':'Public sitemap and same-origin linked pages; public content images and linked documents. No private Squarespace data, form submissions, original layered files, or platform source code.','pages':records,'assets':assets}
    (snapshot/'inventory.json').write_text(json.dumps(data,indent=2))
    print('Captured',len(records),'pages and',len(assets),'assets',flush=True)
if __name__=='__main__': capture()
