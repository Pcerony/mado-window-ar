import {ENCOUNTER_INFO} from './encounter-info.mjs?v=4';
export function createEncounterUI(controller,getSprite){
  const dialog=document.querySelector('#encounter-dialog'),close=document.querySelector('#close-encounter');
  const counters={ferry:0,museum:0,kamome:0};let shown=0,previousFocus=null;
  const text=(selector,value)=>document.querySelector(selector).textContent=value;
  close.onclick=()=>{controller.dismiss();hide()};
  dialog.addEventListener('keydown',e=>{if(e.key==='Escape'){controller.dismiss();hide()}});
  document.querySelector('#encounter-note-button').onclick=()=>{const note=document.querySelector('#encounter-note');note.hidden=!note.hidden;document.querySelector('#encounter-note-button').setAttribute('aria-expanded',String(!note.hidden))};
  function hide(){if(dialog.hidden)return;dialog.hidden=true;document.body.classList.remove('encounter-reading');if(previousFocus?.isConnected)previousFocus.focus({preventScroll:true})}
  function sync(event){
    if(event.phase!=='info'){hide();return}
    if(shown===event.serial)return;
    shown=event.serial;const info=ENCOUNTER_INFO[event.type],fact=info.facts[counters[event.type]++%info.facts.length];
    text('#encounter-title',info.name);text('#encounter-line',info.line);text('#encounter-fact-title',fact.title);text('#encounter-fact',fact.body);text('#encounter-note',info.note);
    document.querySelector('#encounter-note').hidden=true;document.querySelector('#encounter-note-button').setAttribute('aria-expanded','false');
    const rows=document.querySelector('#encounter-details');rows.replaceChildren();
    info.rows.forEach(([label,value])=>{const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;rows.append(dt,dd)});
    document.querySelector('#encounter-source').href=info.source;document.querySelector('#encounter-fact-source').href=fact.source;
    const c=document.querySelector('#encounter-thumbnail'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);const sprite=getSprite(event.type);if(sprite){const scale=Math.min(c.width/sprite.width,c.height/sprite.height);ctx.drawImage(sprite,(c.width-sprite.width*scale)/2,(c.height-sprite.height*scale)/2,sprite.width*scale,sprite.height*scale)}
    previousFocus=document.activeElement;dialog.hidden=false;document.body.classList.add('encounter-reading');close.focus({preventScroll:true});
  }
  return {sync,reset(){shown=0;hide()}};
}
