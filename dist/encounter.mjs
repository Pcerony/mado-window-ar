const ease=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)};
const durations={approach:2.2,lift:1.4,bite:1.1,turn:1,return:1};
const phases={approach:'lift',lift:'bite',bite:'turn',turn:'info',return:'waiting'};
export function createEncounter(rng=Math.random){
  let zone='coast',phase='waiting',time=0,wait=3+rng()*2,serial=0;
  const counts={coast:0,inland:0};let type='ferry';
  const next=()=>zone==='inland'?'museum':counts.coast%2?'kamome':'ferry';
  function reset(newZone=zone){zone=newZone;phase='waiting';time=0;wait=3+rng()*2;type=next()}
  function update(dt,enabled,currentZone=zone){
    if(currentZone!==zone)reset(currentZone);
    if(!enabled||phase==='info')return;
    time+=Math.max(0,Math.min(.1,dt));
    let limit=phase==='waiting'?wait:phase==='approach'&&type==='kamome'?4:durations[phase];
    if(time+1e-8>=limit){time-=limit;
      if(phase==='waiting'){phase='approach';serial++;counts[zone]++}
      else {phase=phases[phase];if(phase==='waiting'){type=next();wait=3+rng()*2}}
    }
  }
  return {update,reset,dismiss(){if(phase==='info'){phase='return';time=0}},snapshot(){const duration=phase==='waiting'?wait:phase==='approach'&&type==='kamome'?4:durations[phase]||1;return {zone,type,phase,time,progress:Math.min(1,time/duration),serial}}};
}
export function encounterPose(event){
  if(!event||event.phase==='waiting')return {weight:0,face:0,mouth:0,shipScale:0};
  const {phase,progress:p}=event;
  return {weight:phase==='approach'?ease(p):phase==='return'?1-ease(p):1,
    face:phase==='turn'?ease(p):phase==='info'?1:phase==='return'?1-ease(p):0,
    mouth:phase==='approach'?ease((p-.65)/.35):phase==='lift'?1:phase==='bite'?Math.max(0,(1-p)*(.45+.55*Math.cos(p*Math.PI*6))):0,
    shipScale:['approach','lift'].includes(phase)?1:phase==='bite'?1-ease(p):0};
}
