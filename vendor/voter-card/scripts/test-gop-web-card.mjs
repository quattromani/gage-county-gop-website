import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..'),out=path.join(root,'public/vote-2026');
const html=fs.readFileSync(path.join(out,'index.html'),'utf8');
test('publication contains exactly the source-derived Republican general-election inclusion set',()=>{const data=JSON.parse(fs.readFileSync(path.join(root,'src/data/elections/2026/election-directory.json')));const aff=new Map(data.affiliations.map(r=>[r.affiliationId,r]));const expected=data.candidacies.filter(r=>r.electionStageGroup==='current-general-election'&&aff.get(r.affiliationId).label==='Republican'&&aff.get(r.affiliationId).sourceId).map(r=>r.candidacyId).sort();const actual=[...html.matchAll(/data-candidacy="([^"]+)"/g)].map(m=>m[1]).sort();assert.deepEqual(actual,expected);assert.ok(!html.includes('COUNTY / CONTINUED'));assert.equal([...html.matchAll(/data-contest="office-beatrice-city-council:Ward [123]" data-limit="1"/g)].length,3);assert.ok(!html.includes('verificationDate'));});
test('download/manifest links are relative and reference real files; ICS includes all 5 dates with CRLF folding',()=>{for(const m of html.matchAll(/(?:href|src)="(\.\/[^"#]+)"/g))assert.ok(fs.existsSync(path.join(out,m[1])),m[1]);const manifest=JSON.parse(fs.readFileSync(path.join(out,'manifest.webmanifest')));assert.equal(manifest.scope,'./');assert.equal(manifest.start_url,'./');const ics=fs.readFileSync(path.join(out,'calendar/all-dates.ics'),'utf8');assert.equal((ics.match(/BEGIN:VEVENT/g)||[]).length,5);assert.equal((ics.match(/BEGIN:VALARM/g)||[]).length,5);assert.ok(ics.includes('DTSTART;VALUE=DATE:20261023'));assert.ok(ics.includes('DTEND;VALUE=DATE:20261024'));assert.ok(!ics.replaceAll('\r\n','').includes('\n'));for(const line of ics.split('\r\n'))assert.ok(Buffer.byteLength(line)<=75);});
function workerHarness(){const handlers={},store=new Map();let online=true,failSave=false;const scope='https://example.org/reference/gop-card/';const norm=k=>typeof k==='string'?k:k.url;const caches={async keys(){return [...store.keys()]},async delete(k){return store.delete(k)},async open(name){if(!store.has(name))store.set(name,new Map());const entries=store.get(name);return {async match(key){const r=entries.get(norm(key));return r?.clone();},async addAll(requests){if(failSave)throw Error('network failure');for(const req of requests)entries.set(req.url,new Response('saved:'+req.url));}}}};const self={registration:{scope},clients:{claim:async()=>{}},skipWaiting(){},addEventListener:(name,cb)=>handlers[name]=cb};vm.runInNewContext(fs.readFileSync(path.join(out,'sw.js'),'utf8'),{self,caches,URL,Request,Response,fetch:async req=>{if(!online)throw Error('offline');return new Response('network');}});return {store,async message(type){let promise,result;handlers.message({data:{type},ports:[{postMessage:r=>result=r}],waitUntil:p=>promise=p});await promise;return result;},async get(url,navigation=false){let response;handlers.fetch({request:{url,method:'GET',mode:navigation?'navigate':'cors'},respondWith:p=>response=p});return response?await response:null;},offline(){online=false;},failSave(){failSave=true;}};}
test('offline saving confirms only complete caches, supports subpaths and returns downloads offline',async()=>{const w=workerHarness();assert.equal((await w.message('STATUS')).ready,false);assert.equal((await w.message('SAVE')).ready,true);w.offline();const page=await w.get('https://example.org/reference/gop-card/',true);assert.equal(page.status,200);assert.match(await page.text(),/saved:/);const image=await w.get('https://example.org/reference/gop-card/assets/candidate-card.png');assert.equal(image.status,200);const absent=await w.get('https://example.org/reference/gop-card/absent');assert.equal(absent.status,503);assert.equal(await w.get('https://other.example/'),null);});
test('failed cache saving reports an error rather than false offline readiness',async()=>{const w=workerHarness();w.failSave();assert.match((await w.message('SAVE')).error,/failure/);assert.equal((await w.message('STATUS')).ready,false);});

test('saving a card preserves caches belonging to other publication locations',async()=>{const w=workerHarness();w.store.set('gage-gop-card-other-location',new Map());await w.message('SAVE');assert.ok(w.store.has('gage-gop-card-other-location'));});

test('calendar controls distinguish Apple subscription, Google creation and downloads',()=>{assert.match(html,/href="webcal:\/\/[^"]+all-dates\.ics"/);assert.ok(!html.includes('download>Add all dates to calendar'));const links=[...html.matchAll(/href="(https:\/\/calendar\.google\.com\/calendar\/render\?[^"]+)"/g)];assert.equal(links.length,5);const url=new URL(links[4][1].replaceAll('&amp;','&'));assert.equal(url.searchParams.get('dates'),'20261103/20261104');assert.equal(url.searchParams.get('ctz'),'America/Chicago');assert.match(url.searchParams.get('details'),/8 AM to 8 PM/);});

test('individual Apple events open inline instead of requesting a download',()=>{assert.equal([...html.matchAll(/href="\.\/calendar\/2026-[0-9-]+\.ics" aria-label="Open/g)].length,5);const headers=fs.readFileSync(path.join(out,'_headers'),'utf8');assert.match(headers,/Content-Type: text\/calendar/);assert.match(headers,/Content-Disposition: inline/);});

test('sticker download and offline copy are included after the footer',()=>{assert.ok(html.indexOf('id="voted"')>html.indexOf('</footer>'));assert.match(html,/download="gage-county-i-voted-2026.png"/);assert.ok(JSON.parse(fs.readFileSync(path.join(out,'build-info.json'))).assets.includes('./assets/sticker.png'));});
test('native sticker sharing sends the image only and handles cancellation and unsupported browsers',async()=>{const {shareSticker}=await import('../src/publications/gage-gop-2026/web/sticker-share.mjs');const file=new File(['image'],'sticker.png',{type:'image/png'});let payload;assert.equal(await shareSticker(file,{canShare:()=>true,share:async data=>{payload=data}}),'handed-off');assert.deepEqual(payload,{files:[file]});assert.equal(await shareSticker(file,{}),'unsupported');assert.equal(await shareSticker(file,{canShare:()=>true,share:async()=>{throw Object.assign(Error(),{name:'AbortError'})}}),'cancelled');});

test('parent links to the project and legacy subscriptions/downloads remain intact',()=>{
 const parent=path.dirname(out);
 const home=fs.readFileSync(path.join(parent,'index.html'),'utf8');
 assert.match(home,/href="\.\/vote-2026\/"/);
 assert.ok(!home.includes('data-contest='));
 assert.match(html,/webcal:\/\/quattromani\.github\.io\/gage-county-gop\/vote-2026\/calendar\/all-dates\.ics/);
 for(const dir of ['calendar','assets'])for(const file of fs.readdirSync(path.join(out,dir)))assert.deepEqual(fs.readFileSync(path.join(parent,dir,file)),fs.readFileSync(path.join(out,dir,file)));
 assert.match(fs.readFileSync(path.join(parent,'sw.js'),'utf8'),/registration\.unregister/);
});

test('social preview is crawlable static metadata with correct PNG dimensions',()=>{
 const image=html.match(/property="og:image" content="([^"]+)"/)[1];
 const url=new URL(image);
 assert.equal(url.origin,'https://quattromani.github.io');
 assert.equal(url.pathname,'/gage-county-gop/vote-2026/assets/facebook-preview.png');
 assert.match(html,/property="og:image:width" content="1200"/);
 assert.match(html,/property="og:image:height" content="630"/);
 for(const [file,w,h] of [['facebook-preview.png',1200,630],['facebook-post-square.png',1080,1080]]){
  const png=fs.readFileSync(path.join(out,'assets',file));
  assert.equal(png.toString('hex',0,8),'89504e470d0a1a0a');
  assert.equal(png.readUInt32BE(16),w);assert.equal(png.readUInt32BE(20),h);
  assert.ok(png.length<8000000);
 }
});

test("candidate ovals are visual references without selection controls",()=>{assert.equal((html.match(/class="ballot-oval" aria-hidden="true"/g)||[]).length,83);assert.ok(!html.includes('type="checkbox"'));assert.ok(!html.includes('My reference marks'));});

test('updated roster preserves write-in status and keeps retention separate',()=>{
 const data=JSON.parse(fs.readFileSync(path.join(root,'src/data/elections/2026/election-directory.json')));
 assert.equal(data.candidacies.length,83); assert.equal(data.candidates.length,82);
 const landon=data.candidacies.find(r=>r.candidateId==='cand-anthony-m-landon');
 assert.equal(landon.filingMethod,'Declared write-in');
 assert.match(html,/Anthony M\. Landon[^<]*<strong class="write-in-label">\(write-in\)/);
 assert.match(html,/Eric G\. Malina/); assert.match(html,/Gene Radar Reedy/);
 assert.equal(data.offices.find(r=>r.officeId==='office-blue-springs-mayor').voteFor,1);
 assert.ok(!html.includes('Mary D. Benes'));
 const judicial=JSON.parse(fs.readFileSync(path.join(root,'src/data/elections/2026/judicial-retention.json')));
 assert.equal(judicial.data.questions.length,6);
 for(const question of judicial.data.questions){ assert.ok(html.includes(question.ballotQuestion)); assert.ok(!data.candidates.some(c=>c.displayName===question.name)); }
 assert.equal((html.match(/data-retention=/g)||[]).length,6);
 assert.match(html,/Inclusion does not recommend a Yes or No vote/);
 assert.match(html,/letter-size PDF has two pages/);
 assert.ok(!html.includes('County filings through August 3'));
});
test('web downloads exactly match regenerated publication artifacts',()=>{
 for(const [source,target] of [['gage-county-gop-2026-candidate-flyer.pdf','print-flyer.pdf'],['gage-county-gop-2026-mobile-card.pdf','candidate-card.pdf'],['gage-county-gop-2026-mobile-card.png','candidate-card.png']])
 assert.deepEqual(fs.readFileSync(path.join(root,'output/pdf',source)),fs.readFileSync(path.join(out,'assets',target)));
});
