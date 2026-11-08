import * as THREE from './vendor/three.module.js';
import {occlude} from './occlusion.mjs?v=3';
import {MONSTER_SCALE,monsterPose} from './monster-layout.mjs';
import {coastAmount} from './world.mjs?v=3';
import {encounterPose} from './encounter.mjs?v=5';
import {createSpriteBank,drawEncounterSprite} from './encounter-sprites.mjs?v=4';
export function createMonster(canvas){
  const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,preserveDrawingBuffer:true});
  renderer.setSize(1400,750);renderer.setPixelRatio(1);renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;
  const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-700,700,375,-375,.1,3000);camera.position.set(0,0,1000);
  scene.add(new THREE.HemisphereLight(0xe4efcf,0x50635e,2.5));const sun=new THREE.DirectionalLight(0xffeed2,3.1);sun.position.set(-200,400,500);scene.add(sun);
  const skin=new THREE.MeshStandardMaterial({color:0x294138,roughness:1,flatShading:true});
  const belly=new THREE.MeshStandardMaterial({color:0x526252,roughness:1,flatShading:true});
  const spineMat=new THREE.MeshStandardMaterial({color:0x9fbfbd,emissive:0x235b5b,emissiveIntensity:.3,roughness:.7,flatShading:true});
  const black=new THREE.MeshStandardMaterial({color:0x122f29,roughness:1});
  const ivory=new THREE.MeshStandardMaterial({color:0xdddac0,roughness:1});
  const eye=new THREE.MeshStandardMaterial({color:0xf5c474,emissive:0xc97929,emissiveIntensity:.6});
  const root=new THREE.Group();root.scale.setScalar(MONSTER_SCALE);root.rotation.y=-.48;scene.add(root);
  const sprites=createSpriteBank();
  function ellipsoid(parent,x,y,z,sx,sy,sz,material=skin){const mesh=new THREE.Mesh(new THREE.SphereGeometry(1,12,9),material);mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);parent.add(mesh);return mesh}
  function segment(parent,a,b,ra,rb,material=skin){const from=new THREE.Vector3(...a),to=new THREE.Vector3(...b),dir=to.clone().sub(from);const m=new THREE.Mesh(new THREE.CylinderGeometry(rb,ra,dir.length(),10),material);m.position.copy(from.add(to).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize());parent.add(m);return m}
  ellipsoid(root,-.18,2.3,0,1.02,1.65,.72);ellipsoid(root,.39,2.12,.29,.57,1.13,.58,belly);
  ellipsoid(root,-.02,3.8,0,.56,1.02,.53);
  const head=new THREE.Group();root.add(head);ellipsoid(head,.27,4.55,0,.74,.49,.5);
  ellipsoid(head,.83,4.48,.02,.58,.28,.43);
  const jaw=new THREE.Group();jaw.position.set(.35,4.3,0);head.add(jaw);ellipsoid(jaw,.42,-.06,.02,.57,.13,.42);
  ellipsoid(head,1.02,4.36,.39,.36,.045,.025,black);
  for(const z of [-.45,.45]){ellipsoid(head,.51,4.65,z,.115,.08,.034,eye);ellipsoid(head,.48,4.76,z,.28,.1,.12);for(let j=0;j<4;j++){segment(head,[.76+j*.13,4.38,z*.8],[.78+j*.13,4.30,z*.8],.035,0,ivory);segment(jaw,[.4+j*.13,.04,z*.8],[.42+j*.13,.1,z*.8],.03,0,ivory)}}
  const limbs=[];
  for(const z of [-.55,.55]){
    const leg=new THREE.Group();leg.position.set(-.14,1.65,z);root.add(leg);ellipsoid(leg,0,-.35,0,.56,.77,.45);segment(leg,[0,-.45,0],[.05,-1.3,.03],.39,.25);ellipsoid(leg,.36,-1.42,.07,.67,.22,.37);for(let j=0;j<3;j++)ellipsoid(leg,.88,-1.4,(j-1)*.23+.04,.22,.08,.09,ivory);limbs.push(leg);
    const arm=new THREE.Group();arm.position.set(.27,3.2,z*.93);root.add(arm);segment(arm,[0,0,0],[.67,-.4,.1],.26,.18);segment(arm,[.67,-.4,.1],[1,-.25,.12],.18,.12);for(let j=0;j<3;j++)segment(arm,[.97,-.28,.03+j*.1],[1.2,-.42,.03+j*.1],.06,.015,ivory);limbs.push(arm);
  }
  const tail=new THREE.Group();tail.position.set(-.65,1.52,0);root.add(tail);
  const tailPoints=[[0,0,0],[-.9,-.35,0],[-1.9,-.65,.08],[-2.9,-.7,.18],[-3.9,-.38,.32],[-4.55,.05,.5]];
  tailPoints.slice(1).forEach((p,i)=>segment(tail,tailPoints[i],p,.57-i*.1,Math.max(.025,.47-i*.11)));
  const plateShape=new THREE.Shape();plateShape.moveTo(0,0);for(const [x,y] of [[-.38,.15],[-.27,.37],[-.68,.38],[-.43,.59],[-.72,.8],[-.21,.72],[-.05,1.02],[.22,.59],[.32,.27],[.2,0]])plateShape.lineTo(x,y);plateShape.closePath();
  const plateGeometry=new THREE.ExtrudeGeometry(plateShape,{depth:.09,bevelEnabled:false});
  function plate(parent,x,y,z,s){const mesh=new THREE.Mesh(plateGeometry,spineMat);mesh.position.set(x,y,z);mesh.scale.setScalar(s);mesh.rotation.z=.18;parent.add(mesh)}
  for(let i=0;i<8;i++){let y=1.6+i*.37;plate(root,-.91+Math.max(0,y-2.7)*.18,y,0,.75+Math.sin(i/7*Math.PI)*.28);for(const z of [-.35,.35])plate(root,-.78+Math.max(0,y-2.7)*.18,y-.08,z,.5+Math.sin(i)*.1)}
  tailPoints.slice(1,-1).forEach((p,i)=>plate(tail,p[0],p[1]+.24,p[2],.55-i*.1));
  const ctx=canvas.getContext('2d');
  function render(distance,layout={},event=null){
    const phase=distance/45,pose=monsterPose(distance),action=encounterPose(event),x=pose.x+(-160-pose.x)*action.weight;
    root.position.set(x,pose.y,0);root.rotation.z=Math.sin(phase)*.012*(1-action.weight);root.rotation.y=-.48+(-Math.PI/2+.48)*action.face;
    jaw.rotation.z=-.65*action.mouth;
    limbs[0].rotation.z=Math.sin(phase)*.24*(1-action.weight);limbs[2].rotation.z=Math.sin(phase+Math.PI)*.24*(1-action.weight);limbs[1].rotation.z=Math.sin(phase+Math.PI)*.12-.5*action.mouth;limbs[3].rotation.z=Math.sin(phase)*.12-.5*action.mouth;tail.rotation.y=Math.sin(phase*.5)*.13;
    renderer.render(scene,camera);ctx.clearRect(0,0,1400,750);
    if(event&&action.shipScale>0){const mouth=new THREE.Vector3(1.08,4.36,.05);root.localToWorld(mouth);mouth.project(camera);drawEncounterSprite(ctx,sprites.get(event.type),event,{x:(mouth.x+1)*700,y:(1-mouth.y)*375},action.shipScale)}
    ctx.drawImage(renderer.domElement,0,0);
    const coast=coastAmount(distance);
    if(coast>0){ctx.save();ctx.globalAlpha=coast;ctx.globalCompositeOperation='destination-out';ctx.fillRect(0,450,1400,300);ctx.globalCompositeOperation='source-over';ctx.strokeStyle='#d9e9d7';ctx.lineWidth=1.4;for(let i=0;i<3;i++){ctx.globalAlpha=coast*(.65-i*.16);ctx.beginPath();ctx.ellipse(720+x,450+i*5,85+i*24,5+i*2,0,Math.PI*.06,Math.PI*.94);ctx.stroke()}ctx.restore()}
    occlude(ctx,distance,layout);canvas.dataset.distance=distance.toFixed(2);canvas.dataset.encounter=event?.phase||'waiting';canvas.dataset.subject=event?.type||'';canvas.dataset.eventTime=(event?.time||0).toFixed(2);canvas.dataset.facing=action.face.toFixed(2);
  }
  return {render,prepare:type=>sprites.ensure(type),sprite:type=>sprites.get(type),dispose(){renderer.dispose();scene.traverse(o=>{o.geometry?.dispose()});[skin,belly,spineMat,black,ivory,eye].forEach(m=>m.dispose())}};
}
