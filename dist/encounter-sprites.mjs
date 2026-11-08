const urls={ferry:'sunflower-original.png',kamome:'kamome-original.png',museum:'kyuhaku-original.png'};
export function createSpriteBank(){
  const bank=new Map();
  function ensure(type){
    const entry=bank.get(type);if(entry)return entry.status;
    const item={status:'loading',canvas:null};bank.set(type,item);
    let image=new Image();image.onload=()=>{
      const sprite=document.createElement('canvas');sprite.width=1024;sprite.height=Math.round(1024*image.naturalWidth/image.naturalHeight);
      const ctx=sprite.getContext('2d');ctx.translate(sprite.width/2,sprite.height/2);ctx.rotate(-Math.PI/2);
      ctx.drawImage(image,-sprite.height/2,-sprite.width/2,sprite.height,sprite.width);
      item.canvas=sprite;item.status='ready';image.onload=image.onerror=null;image.src='';image=null;
    };
    image.onerror=()=>{item.status='error';image.onload=image.onerror=null;image=null};
    image.src=new URL('./assets/'+urls[type],import.meta.url).href;
    return item.status;
  }
  return {ensure,get:type=>bank.get(type)?.canvas||null};
}
const mix=(a,b,t)=>a+(b-a)*t;
const ease=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)};
export function drawEncounterSprite(ctx,sprite,event,mouth,scale){
  if(!sprite||scale<=0)return;
  const p=event.progress,bird=event.type==='kamome',museum=event.type==='museum';
  let x=1100,y=410,width=museum?360:300,angle=0;
  if(event.phase==='approach'){
    if(bird){
      if(p<.42){const k=ease(p/.42);x=mix(1410,1030,k);y=mix(100,205,k);width=mix(120,430,k)}
      else if(p<.67){x=1030+Math.sin(p*26)*10;y=205+Math.sin(p*22)*7;width=430}
      else{const k=ease((p-.67)/.33);x=mix(1030,mouth.x+180,k);y=mix(205,320,k);width=mix(430,150,k)}
      angle=Math.sin(event.time*8)*.045;
    }else{x=mix(1410,mouth.x+190,ease(p));y=museum?410:420+Math.sin(event.time*3)*4}
  }else if(event.phase==='lift'){
    const k=ease(p);x=mix(mouth.x+180,mouth.x+45,k);y=mix(bird?320:410,mouth.y+10,k);width=bird?150:width;angle=Math.sin(p*Math.PI)*-.15;
  }else if(event.phase==='bite'){x=mouth.x+45*scale;y=mouth.y+10*scale;width=bird?150:width}
  else return;
  const w=width*scale,h=w*sprite.height/sprite.width;
  ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.drawImage(sprite,-w/2,-h/2,w,h);ctx.restore();
}
