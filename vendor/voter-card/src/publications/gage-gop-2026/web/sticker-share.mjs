// Share only the public image; reference marks and device state never enter this payload.
export async function shareSticker(file,nav){
 if(!file||!nav.share||!nav.canShare?.({files:[file]}))return 'unsupported';
 try{await nav.share({files:[file]});return 'handed-off';}
 catch(error){return error.name==='AbortError'?'cancelled':'failed';}
}
