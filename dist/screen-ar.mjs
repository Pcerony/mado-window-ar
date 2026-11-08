import {MARKERS} from './ar-core.mjs';
const view=document.querySelector('.window-view'),carriage=document.querySelector('.carriage');
let active=false,markers=[];
const button=document.querySelector('#connect-phone'),dialog=document.querySelector('#phone-dialog');
const dictionary=new AR.Dictionary('ARUCO_MIP_36h12');
for(const id of MARKERS){const el=document.createElement('div');el.className='ar-marker';el.innerHTML=dictionary.generateSVG(id);el.setAttribute('aria-hidden','true');carriage.append(el);markers.push(el)}
function layout(){const b=view.getBoundingClientRect(),c=carriage.getBoundingClientRect();const points=[[b.left,b.top],[b.right,b.top],[b.right,b.bottom],[b.left,b.bottom]];markers.forEach((m,i)=>{m.style.left=points[i][0]-c.left+'px';m.style.top=points[i][1]-c.top+'px'});updateQR(Math.round(b.width),Math.round(b.height));}
new ResizeObserver(layout).observe(view);
function toggle(on){active=on;document.body.classList.toggle('ar-enabled',active);button.setAttribute('aria-pressed',String(active));button.title=active?'手机 AR 已开启':'连接 iPhone';document.dispatchEvent(new CustomEvent('ar-mode',{detail:active}));layout()}
button.onclick=()=>{toggle(true);dialog.showModal()};
document.querySelector('#close-phone').onclick=()=>dialog.close();
document.querySelector('#disable-ar').onclick=()=>{toggle(false);dialog.close()};
const production='https://armado.heisei.space/';
function updateQR(width,height){const url=new URL('./',location.protocol==='https:'?location.href:production);url.searchParams.set('w',width);url.searchParams.set('h',height);document.querySelector('#phone-link').href=url.href;QRCode.toCanvas(document.querySelector('#phone-qr'),url.href,{width:216,margin:2,color:{dark:'#203e33',light:'#ffffff'}},error=>{if(error)document.querySelector('#phone-message').textContent='二维码生成失败，请使用手机端链接。'});}
layout();
toggle(true);
