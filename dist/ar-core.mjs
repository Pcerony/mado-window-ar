export const MARKERS=[12,13,14,15];
export const PLANE=[0,0,1400,0,1400,750,0,750];
export const CODE={x:190,y:720,width:1020,height:22,bits:40};
export function encodeDistance(distance){
  const value=Math.max(0,Math.round(distance*4))%0x1000000;
  const check=((value>>>16)^(value>>>8)^value^0xa7)&255;
  const bytes=[0xd3,value>>>16,(value>>>8)&255,value&255,check];
  return bytes.flatMap(byte=>Array.from({length:8},(_,i)=>(byte>>>(7-i))&1));
}
export function decodeDistance(bits){
  if(bits.length!==40)return null;
  const bytes=Array.from({length:5},(_,j)=>bits.slice(j*8,j*8+8).reduce((v,b)=>(v<<1)|b,0));
  if(bytes[0]!==0xd3||((bytes[1]^bytes[2]^bytes[3]^0xa7)&255)!==bytes[4])return null;
  return ((bytes[1]<<16)|(bytes[2]<<8)|bytes[3])/4;
}
export function markerQuad(markers){
  const ordered=MARKERS.map(id=>markers.find(m=>m.id===id));
  if(ordered.some(m=>!m))return null;
  const p=ordered.map(m=>m.corners.reduce((a,c)=>[a[0]+c.x/4,a[1]+c.y/4],[0,0]));
  let area=0;
  for(let i=0;i<4;i++){const a=p[i],b=p[(i+1)%4],c=p[(i+2)%4];if((b[0]-a[0])*(c[1]-b[1])-(b[1]-a[1])*(c[0]-b[0])<10)return null;area+=a[0]*b[1]-b[0]*a[1]}
  return area>4000?p.flat():null;
}
export function trackingVisible(now,lastQuad,lastCode){return lastQuad>0&&lastCode>0&&now-lastQuad<220&&now-lastCode<350;}
export function paintCode(ctx,distance){
  ctx.fillStyle='#fff';ctx.fillRect(CODE.x-7,CODE.y-4,CODE.width+14,CODE.height+8);
  encodeDistance(distance).forEach((b,i)=>{ctx.fillStyle=b?'#fff':'#000';ctx.fillRect(CODE.x+i*CODE.width/CODE.bits,CODE.y,CODE.width/CODE.bits+.1,CODE.height)});
}
export function readCode(image,transform){
  const {width,height,data}=image;
  function sample(x,y){const p=transform.transform(x,y),px=Math.round(p[0]),py=Math.round(p[1]);if(px<0||py<0||px>=width||py>=height)return null;const k=(py*width+px)*4;return(data[k]+data[k+1]+data[k+2])/3}
  const levels=[];
  for(let i=0;i<CODE.bits;i++){let sum=0;for(const dy of [.3,.5,.7]){const v=sample(CODE.x+(i+.5)*CODE.width/CODE.bits,CODE.y+CODE.height*dy);if(v===null)return null;sum+=v}levels.push(sum/3)}
  const lo=Math.min(...levels),hi=Math.max(...levels);if(hi-lo<55)return null;
  return decodeDistance(levels.map(v=>v>(lo+hi)/2?1:0));
}
export function cssMatrix(coeffs){const [a,b,c,d,e,f,g,h]=coeffs;return `matrix3d(${a},${d},0,${g},${b},${e},0,${h},0,0,1,0,${c},${f},0,1)`;}
