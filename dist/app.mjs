import {random as r,district,buildings,advance} from './world.mjs';
import {paintCode} from './ar-core.mjs';
const canvas=document.querySelector('canvas'),ctx=canvas.getContext('2d');
const state={distance:0,speed:1,paused:matchMedia('(prefers-reduced-motion: reduce)').matches,sound:false};
let width=1400,height=750,last=0,audio,volume,arMode=false;
document.addEventListener('ar-mode',e=>{arMode=e.detail;render()});
const colors=['#e6e0ce','#d8d9cd','#d9d1bf','#c3ccbf','#e5dacb'];
function path(points,fill,stroke,line=1){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));if(fill){ctx.closePath();ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=line;ctx.stroke()}}
function rect(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(x,y,w,h)}
function ellipse(x,y,rx,ry,color){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=color;ctx.fill()}
function cloud(x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='#fafbf0';ctx.beginPath();ctx.moveTo(-100,0);ctx.bezierCurveTo(-90,-15,-68,-11,-53,-13);ctx.bezierCurveTo(-60,-40,-17,-49,-4,-26);ctx.bezierCurveTo(12,-66,62,-52,63,-22);ctx.bezierCurveTo(85,-31,102,-12,114,-5);ctx.bezierCurveTo(140,-1,144,6,108,9);ctx.bezierCurveTo(40,14,-67,11,-100,0);ctx.fill();ctx.restore()}
function mountains(d){for(let l=0;l<4;l++){const scale=[.025,.045,.065,.10][l],base=[294,319,348,376][l];let pts=[[0,510]];for(let x=-10;x<1420;x+=8){let n=x+d*scale;pts.push([x,base+Math.sin(n/180+l*7)*38+Math.sin(n/77+l*2)*19+Math.sin(n/39+l)*6]);}pts.push([1420,510]);path(pts,['#9ab9b4','#8fafab','#81a398','#74978b'][l]);if(l===3){ctx.globalAlpha=.12;for(let x=-10;x<1450;x+=16){let n=x+d*scale;let y=base+Math.sin(n/180+l*7)*38+Math.sin(n/77+l*2)*19+Math.sin(n/39+l)*6;path([[x,y+5],[x-12,y+65],[x+23,y+59]],'#dce9bb')}ctx.globalAlpha=1}}}
function tree(x,y,s,seed){ctx.save();ctx.translate(x,y);ctx.scale(s,s);rect(-2,-20,4,22,'#7c8060');ellipse(0,-34,17,28,'#527b67');ellipse(-12,-25,15,19,'#628c70');ellipse(12,-28,16,22,'#6d9576');ellipse(4,-44,13,17,'#769b7c');ctx.restore()}
function house(b,offset,back=false){let x=b.x-offset,y=back?422:502,h=b.height*(back?.65:1),w=b.width*(back?.8:1);if(x<-180||x>1450)return;let tall=h>103;const body=colors[b.color];
rect(x+7,y-2,w+13,5,'#728c713b');rect(x,y-h,w,h,body);path([[x+w,y-h],[x+w+16,y-h-9],[x+w+16,y-8],[x+w,y]],'#b6beae');
if(tall){rect(x-3,y-h-4,w+7,6,'#a1aca3');rect(x+9,y-h-13,18,9,'#b9c0b4');for(let yy=y-h+16;yy<y-10;yy+=25){rect(x+4,yy+17,w-8,3,'#b0baad');for(let xx=x+10;xx<x+w-9;xx+=21){rect(xx,yy,12,14,'#789a9b');rect(xx+1,yy,2,14,'#b6c9bc')}}}
else{const roof=['#657b7a','#6d7d76','#7a7e70','#637777','#6c807d'][b.color];path([[x-10,y-h],[x+w*.46,y-h-30],[x+w+10,y-h],[x+w+4,y-h+6],[x-8,y-h+6]],roof,'#5a716a',1);for(let k=0;k<6;k++)path([[x-4+k*w/6,y-h+1],[x+w*.46+(k-3)*5,y-h-26]],null,'#91a294',.7);
if(h>55){rect(x+4,y-h+34,w-8,3,'#b3baa7');for(let j=0;j<3;j++){rect(x+10+j*(w-18)/3,y-h+13,13,18,'#7e9c9b');rect(x+16+j*(w-18)/3,y-h+13,1,18,'#cbd1bc')}}
rect(x+w*.4,y-27,17,27,'#8e9d90');rect(x+9,y-26,16,15,'#779590');rect(x+w-23,y-27,15,16,'#7b9792');rect(x+8,y-10,18,2,'#c8ceba');if(b.kind>.7){rect(x-3,y-38,w+6,8,'#77978b');rect(x+5,y-36,w-10,2,'#d9d9bf')}
}
if(!back){rect(x+w+1,y-15,11,13,'#cad0c0');path([[x+w+3,y-11],[x+w+9,y-11]],null,'#99aa98');if(b.kind>.52)tree(x-17,y+2,.7,b.id);if(b.kind<.3){rect(x+w+22,y-4,26,4,'#e1dbbf');rect(x+w+26,y-12,15,9,'#c9d7ce');ellipse(x+w+26,y,3,3,'#667971');ellipse(x+w+44,y,3,3,'#667971')}}}
function fields(d){rect(0,409,1400,341,'#a5b87a');for(let row=0;row<6;row++){let speed=.28+row*.11,cell=240+row*35,off=d*speed;let y=440+row*48;for(let i=Math.floor(off/cell)-1;i<(off+1400)/cell+1;i++){let x=i*cell-off;let n=r(i+row*190);path([[x,y],[x+cell-8,y-8],[x+cell+75,y+39],[x-26,y+49]],['#b8c58a','#9fb77c','#c2c990','#a5bd81','#b1c481'][Math.floor(n*5)]);path([[x,y+3],[x+cell-8,y-5]],null,'#d6d6a2',3);for(let j=0;j<7;j++)path([[x+j*cell/7,y+5],[x-21+j*(cell+90)/7,y+43]],null,'#809e6742',1);}}
// A narrow irrigation channel follows the track.
path([[0,624],[1400,614],[1400,650],[0,660]],'#9cbcb0');path([[0,623],[1400,613]],null,'#d2d2ad',5);path([[0,661],[1400,651]],null,'#d5d4b2',5);for(let i=0;i<18;i++){let x=((i*97-d*.8)%1600+1600)%1600-100;path([[x,638],[x+26,638]],null,'#c3d6c1',1)}}
function pole(x,small=false){let y=small?442:714,top=small?264:89;let color=small?'#718d7c':'#667c70';rect(x,top,small?3:7,y-top,color);path([[x-28,top+25],[x+31,top+25]],null,color,small?3:5);if(!small){rect(x-4,top+50,15,25,'#a5b2a0');for(let a of [-22,21]){rect(x+a,top+15,5,12,'#b8c4ae');rect(x+a-1,top+15,7,2,'#718978')}path([[x+4,top+30],[x+35,y]],null,'#718674',1);path([[x-550,top+27],[x-410,top+46],[x-280,top+55],[x-150,top+47],[x,top+27],[x+150,top+47],[x+280,top+55],[x+410,top+46],[x+550,top+27]],null,'#6b8275',1.2);path([[x-550,top+18],[x-270,top+43],[x,top+18],[x+270,top+43],[x+550,top+18]],null,'#6b8275',.7)}}
function render(){const d=state.distance;const sx=canvas.width/1400,sy=canvas.height/750,scale=width<600?Math.max(sx,sy):sx;ctx.setTransform(scale,0,0,width<600?scale:sy,width<600?(canvas.width-1400*scale)/2:0,0);let sky=ctx.createLinearGradient(0,0,0,420);sky.addColorStop(0,'#8fc4ce');sky.addColorStop(.65,'#c3dcd5');sky.addColorStop(1,'#e5e7c9');ctx.fillStyle=sky;ctx.fillRect(0,0,1400,750);ellipse(1100,104,37,37,'#f4f1ce');for(let i=0;i<7;i++){let x=((i*337-d*.012)%1900+1900)%1900-250;cloud(x,75+r(i)*115,.45+r(i+8)*.75)}mountains(d);fields(d);
for(let i=Math.floor(d*.18/65)-2;i<(d*.18+1450)/65+1;i++)tree(i*65-d*.18,422,.55+r(i)*.3,i);
for(let b of buildings(d*.24,1600)){if(r(b.id+71)<.35+b.urban*.6)house(b,d*.24,true)}
rect(0,497,1400,13,'#bfc5ab');path([[0,509],[1400,509]],null,'#daddc0',3);
for(let b of buildings(d*.48,1600)){if(r(b.id+51)<.25+b.urban*.7)house(b,d*.48)}
// Small allotments, signals and hedges occupy different world-coordinate layers.
for(let i=Math.floor(d*.72/210)-1;i<(d*.72+1500)/210;i++){let x=i*210-d*.72;if(r(i+201)>.38){tree(x,575,1+r(i+6)*.4,i);tree(x+20,576,.8,i+1)}if(r(i+111)>.7){rect(x+60,502,3,58,'#9aab91');rect(x+46,499,32,20,'#e2dfc7');rect(x+47,502,30,4,'#6b9180')}}
for(let i=Math.floor(d*.3/230)-1;i<(d*.3+1450)/230;i++)pole(i*230-d*.3,true);
rect(0,704,1400,46,'#9eae86');for(let i=Math.floor(d*1.5/35)-1;i<(d*1.5+1450)/35;i++){let x=i*35-d*1.5;path([[x,738],[x+4,716],[x+8,729],[x+16,710],[x+20,738]],'#80986c')}
path([[0,699],[1400,699]],null,'#d3d3b5',7);path([[0,706],[1400,706]],null,'#708875',2);
for(let i=Math.floor(d*1.25/550)-1;i<(d*1.25+1450)/550;i++)pole(i*550-d*1.25);
// Sparse paper grain is fixed to the view instead of visibly scrolling.
ctx.globalAlpha=.035;for(let i=0;i<1900;i++){rect(r(i+900)*1400,r(i+5000)*750,1,1,i%2?'#193e39':'#fffef0')}ctx.globalAlpha=1;
if(arMode)paintCode(ctx,d);
document.querySelector('#district').textContent=district(d*.48).name;document.querySelector('#distance').textContent=(d/9000).toFixed(1);canvas.dataset.distance=d.toFixed(3);
}
function resize(){let box=canvas.getBoundingClientRect();width=box.width;height=box.height;const ratio=Math.min(devicePixelRatio,2);canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);render()}
new ResizeObserver(resize).observe(canvas);
function frame(time){if(!document.hidden){state.distance=advance(state.distance,(time-last)/1000,state.speed,state.paused);render();if(audio&&state.sound&&!state.paused)volume.gain.setTargetAtTime(.12+Math.pow(Math.sin(state.distance/14),18)*.08,audio.currentTime,.035)}last=time;requestAnimationFrame(frame)}
function icon(id,name){document.querySelector(id).innerHTML=`<i data-lucide="${name}"></i>`;globalThis.lucide?.createIcons()}
function syncPause(){document.body.classList.toggle('paused',state.paused);let b=document.querySelector('#pause');b.setAttribute('aria-pressed',String(state.paused));b.setAttribute('aria-label',state.paused?'继续行驶':'暂停');b.title=b.getAttribute('aria-label');icon('#pause',state.paused?'play':'pause');syncAudio()}
document.querySelector('#pause').onclick=()=>{state.paused=!state.paused;syncPause()};
document.querySelector('#speed').oninput=e=>{state.speed=+e.target.value;document.querySelector('#speed-value').value=state.speed.toFixed(1)+'×';if(audio)audio.rail.playbackRate.setTargetAtTime(.7+state.speed*.3,audio.currentTime,.2)};
function createAudio(){audio=new AudioContext();let buffer=audio.createBuffer(1,audio.sampleRate*4,audio.sampleRate),data=buffer.getChannelData(0);let low=0;for(let i=0;i<data.length;i++){low=(low+Math.random()*.04-.02)/1.02;data[i]=low*5+(Math.random()-.5)*.13}let source=audio.createBufferSource();source.buffer=buffer;source.loop=true;let filter=audio.createBiquadFilter();filter.type='lowpass';filter.frequency.value=650;volume=audio.createGain();volume.gain.value=0;source.connect(filter).connect(volume).connect(audio.destination);source.start();audio.rail=source}
async function syncAudio(){if(!audio)return;try{if(state.sound&&!state.paused&&!document.hidden)await audio.resume();else await audio.suspend()}catch{state.sound=false;document.querySelector('#sound').setAttribute('aria-pressed','false');icon('#sound','volume-x')}}
document.querySelector('#sound').onclick=()=>{if(!audio)createAudio();state.sound=!state.sound;let b=document.querySelector('#sound');b.setAttribute('aria-pressed',String(state.sound));b.setAttribute('aria-label',state.sound?'关闭电车声':'开启电车声');b.title=b.getAttribute('aria-label');icon('#sound',state.sound?'volume-2':'volume-x');syncAudio()};
document.querySelector('#fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{document.querySelector('#fullscreen').title='当前浏览器不支持全屏'}};
document.addEventListener('fullscreenchange',()=>{let full=!!document.fullscreenElement;icon('#fullscreen',full?'minimize':'maximize');document.querySelector('#fullscreen').setAttribute('aria-label',full?'退出全屏':'全屏')});
document.addEventListener('visibilitychange',()=>{last=performance.now();syncAudio()});
globalThis.lucide?.createIcons();syncPause();requestAnimationFrame(t=>{last=t;frame(t)});
