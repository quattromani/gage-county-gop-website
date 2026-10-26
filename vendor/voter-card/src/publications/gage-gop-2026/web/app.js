import {shareSticker} from './sticker-share.mjs';
document.querySelectorAll('.js-only').forEach(el=>el.hidden=false);
const jump=document.querySelector('#jump');jump.addEventListener('change',()=>{if(!jump.value)return;const target=document.getElementById(jump.value);target.scrollIntoView();target.querySelector('h2')?.focus({preventScroll:true});jump.value='';});
// Keep previously saved offline copies available without adding more save controls.
if('serviceWorker' in navigator && window.isSecureContext)navigator.serviceWorker.register('./sw.js').catch(()=>{});
const share=document.querySelector('#share');
share.addEventListener('click',async()=>{const url=new URL('./',location.href).href;try{if(navigator.share)await navigator.share({title:'Gage County GOP · 2026 Candidate Card',url});else{await navigator.clipboard.writeText(url);share.textContent='Link copied';}}catch(error){if(error.name!=='AbortError'){share.textContent='Copy the address from your browser';}}});

// Follow the permanent host automatically once the custom domain is connected.
if(location.protocol==='https:')document.querySelectorAll('[data-webcal]').forEach(link=>{const url=new URL('./calendar/'+link.dataset.webcal,location.href);link.href='webcal:'+url.href.slice(url.protocol.length);});

const stickerPanel=document.querySelector('#sticker-panel');
const revealSticker=document.querySelector('#sticker-reveal');
const stickerShare=document.querySelector('#sticker-share');
const stickerStatus=document.querySelector('#sticker-status');
stickerPanel.hidden=true;
let stickerFile;
revealSticker.addEventListener('click',()=>{
 stickerPanel.hidden=false;revealSticker.setAttribute('aria-expanded','true');revealSticker.hidden=true;
 document.querySelector('#sticker-message').focus({preventScroll:true});
 // Prepare the file before the separate Share tap, preserving iOS user activation.
 stickerShare.disabled=true;
 fetch('./assets/sticker.png').then(response=>{if(!response.ok)throw Error('Image unavailable');return response.blob();}).then(blob=>{
  stickerFile=new File([blob],'gage-county-i-voted-2026.png',{type:'image/png'});
  stickerShare.disabled=false;
 }).catch(()=>{stickerStatus.textContent='Sharing could not load. Open the sticker below to save it, or try again when connected.';});
});
stickerShare.addEventListener('click',async()=>{
 stickerShare.disabled=true;
 const result=await shareSticker(stickerFile,navigator);
 stickerShare.disabled=false;
 stickerStatus.textContent=result==='unsupported'||result==='failed'?'This browser could not share the image. Save it below, then attach it to your Facebook post or message.':result==='handed-off'?'Your phone handled the sharing request.':'Sharing canceled. Your sticker is still ready to save.';
});
