import {PLANE,MARKERS,markerQuad,readFrame,trackingVisible,cssMatrix} from './ar-core.mjs?v=4';
import {coastAmount} from './world.mjs?v=3';
import {createEncounter} from './encounter.mjs?v=5';
import {createEncounterUI} from './encounter-ui.mjs?v=4';
import {requestCamera,cameraErrorMessage} from './camera.mjs?v=4';
import {bindViewport,videoProjection} from './viewport.mjs?v=5';
const video=document.querySelector('#camera'),projection=document.querySelector('#projection'),canvas=document.querySelector('#creature');
const stage=document.querySelector('#ar-app');bindViewport(stage);
const panel=document.querySelector('#start-panel'),start=document.querySelector('#start-camera'),message=document.querySelector('#camera-message');
const status=document.querySelector('#tracking-text'),count=document.querySelector('#scan-count'),hint=document.querySelector('#scan-hint');
const stop=document.querySelector('#stop-camera'),flip=document.querySelector('#flip-camera');
const capture=document.createElement('canvas'),ctx=capture.getContext('2d',{willReadFrequently:true});
const detector=new AR.Detector({dictionaryName:'ARUCO_MIP_36h12',maxHammingDistance:3});
const params=new URLSearchParams(location.search),layout={width:Math.max(300,Math.min(4000,+params.get('w')||1200)),height:Math.max(150,Math.min(3000,+params.get('h')||500))};
let stream=null,monster=null,active=false,generation=0,facing='environment',raf=0;
let lastDetection=0,lastRender=0,lastQuad=0,lastCode=0,lastEventFrame=0,quad=null,distance=0,velocity=0;
const encounter=createEncounter(),encounterUI=createEncounterUI(encounter,type=>monster?.sprite(type));
function setStatus(text){status.textContent=text}
function showCameraControls(on){stop.hidden=!on;flip.hidden=!on;count.hidden=!on;hint.hidden=!on}
function resetTracking(){lastQuad=lastCode=0;velocity=0;quad=null;projection.style.opacity='0';document.body.classList.remove('locked');count.textContent='0 / 4'}
function stopCamera(){generation++;active=false;cancelAnimationFrame(raf);if(stream)stream.getTracks().forEach(t=>t.stop());stream=null;video.srcObject=null;resetTracking();encounter.reset();encounterUI.reset();lastEventFrame=0;document.body.classList.remove('scanning');panel.hidden=false;showCameraControls(false);setStatus('カメラ停止中');start.disabled=false;start.innerHTML='<i data-lucide="camera"></i>カメラを起動';lucide.createIcons()}
async function startCamera(){
  if(start.disabled)return;
  const token=++generation;start.disabled=true;start.textContent='カメラの許可を待っています…';setStatus('カメラの許可待ち');stop.hidden=false;
  try{
    if(!isSecureContext)throw Object.assign(new Error(),{name:'InsecureContext'});
    if(!navigator.mediaDevices?.getUserMedia)throw Object.assign(new Error(),{name:'CameraUnsupported'});
    const media=await requestCamera(navigator.mediaDevices,facing);
    if(token!==generation){media.getTracks().forEach(t=>t.stop());return}
    stream=media;video.srcObject=media;await video.play();if(token!==generation)return;
    if(!monster){try{const {createMonster}=await import('./monster.mjs?v=5');if(token!==generation)return;monster=createMonster(canvas)}catch(cause){throw Object.assign(new Error('AR renderer could not start'),{name:'GraphicsError',cause})}}
    active=true;lastDetection=0;resetTracking();panel.hidden=true;document.body.classList.add('scanning');showCameraControls(true);setStatus('車窓を探しています');start.disabled=false;start.innerHTML='<i data-lucide="camera"></i>カメラを起動';lucide.createIcons();raf=requestAnimationFrame(frame);
  }catch(error){
    if(token!==generation)return;
    console.warn('Camera start failed:',error.name);
    stopCamera();message.textContent=cameraErrorMessage(error.name,navigator.userAgent);setStatus(error.name==='GraphicsError'?'AR を読み込めません':'カメラを起動できません');start.textContent='もう一度試す';
  }
}
function frame(now){
  if(!active)return;
  if(video.readyState>=2&&now-lastDetection>=85){
    lastDetection=now;
    const scale=Math.min(1,960/Math.max(video.videoWidth,video.videoHeight));capture.width=Math.round(video.videoWidth*scale);capture.height=Math.round(video.videoHeight*scale);ctx.drawImage(video,0,0,capture.width,capture.height);
    const image=ctx.getImageData(0,0,capture.width,capture.height);const markers=detector.detect(image);const found=new Set(markers.filter(m=>MARKERS.includes(m.id)).map(m=>m.id));count.textContent=`${found.size} / 4`;
    const detected=markerQuad(markers);
    if(detected){
      const transform=PerspT(PLANE,detected);const value=readFrame(image,transform);
      lastQuad=now;quad=detected;
      if(value!==null){velocity=lastCode?Math.max(0,Math.min(250,(value.distance-distance)/((now-lastCode)/1000))):0;distance=value.distance;layout.width=value.width;layout.height=value.height;lastCode=now}
      const {scale:cover,dx,dy}=videoProjection(capture.width,capture.height,video.getBoundingClientRect(),stage.getBoundingClientRect());
      const displayed=quad.map((v,i)=>v*cover+(i%2?dy:dx));const warp=PerspT(PLANE,displayed);projection.style.transform=cssMatrix(warp.coeffs);
    }
    const locked=trackingVisible(now,lastQuad,lastCode);projection.style.opacity=locked?'1':'0';document.body.classList.toggle('locked',locked);setStatus(locked?'認識中 · 窓の向こう':detected?'同期コードを読み取り中':'車窓を探しています');
  }
  const tracked=trackingVisible(now,lastQuad,lastCode),coast=coastAmount(distance),zone=coast>.5?'coast':'inland';
  encounter.update(0,false,zone);
  const asset=tracked?monster.prepare(encounter.snapshot().type):'loading';
  const eligible=tracked&&asset==='ready'&&(coast<.15||coast>.85)&&!help.open;
  encounter.update(lastEventFrame?(now-lastEventFrame)/1000:0,eligible,zone);lastEventFrame=now;
  const event=encounter.snapshot();encounterUI.sync(event);
  if(!tracked){projection.style.opacity='0';document.body.classList.remove('locked')}
  else if(now-lastRender>30){monster.render(distance+velocity*Math.min(.10,(now-lastCode)/1000),layout,event);lastRender=now;if(asset==='error')setStatus('イラストを読み込めません')}
  raf=requestAnimationFrame(frame);
}
start.onclick=startCamera;stop.onclick=stopCamera;
flip.onclick=()=>{facing=facing==='environment'?'user':'environment';stopCamera();startCamera()};
const help=document.querySelector('#help-dialog');document.querySelector('#help').onclick=()=>help.showModal();document.querySelector('#close-help').onclick=()=>help.close();
document.addEventListener('visibilitychange',()=>{if(document.hidden&&(active||start.disabled)){stopCamera();message.textContent='カメラを起動して、車窓の旅を続けましょう'}});
window.addEventListener('pagehide',stopCamera);window.addEventListener('resize',resetTracking);
lucide.createIcons();
