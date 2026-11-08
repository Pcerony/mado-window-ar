import {buildings,random as r} from './world.mjs';
export function occlude(ctx,distance,{width=1200,height=500}={}){
  ctx.save();ctx.globalCompositeOperation='destination-out';ctx.fillStyle='#000';
  const rect=(x,y,w,h)=>ctx.fillRect(x,y,w,h);
  const poly=pts=>{ctx.beginPath();pts.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fill()};
  const ellipse=(x,y,rx,ry)=>{ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill()};
  const tree=(x,y,s)=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);rect(-2,-20,4,22);ellipse(0,-34,17,28);ellipse(-12,-25,15,19);ellipse(12,-28,16,22);ellipse(4,-44,13,17);ctx.restore()};
  for(const b of buildings(distance*.48,1600)){
    if(r(b.id+51)>=.25+b.urban*.7)continue;
    const x=b.x-distance*.48,y=502,w=b.width,h=b.height;
    rect(x,y-h,w,h);poly([[x+w,y-h],[x+w+16,y-h-9],[x+w+16,y-8],[x+w,y]]);
    if(h>103){rect(x-3,y-h-4,w+7,6);rect(x+9,y-h-13,18,9)}
    else poly([[x-10,y-h],[x+w*.46,y-h-30],[x+w+10,y-h],[x+w+4,y-h+6],[x-8,y-h+6]]);
    if(b.kind>.52)tree(x-17,y+2,.7);
  }
  for(let i=Math.floor(distance*.72/210)-1;i<(distance*.72+1500)/210;i++){const x=i*210-distance*.72;if(r(i+201)>.38){tree(x,575,1+r(i+6)*.4);tree(x+20,576,.8)}}
  for(let i=Math.floor(distance*1.25/550)-1;i<(distance*1.25+1450)/550;i++){
    const x=i*550-distance*1.25;rect(x,89,7,625);rect(x-28,112,59,5);rect(x-4,139,15,25);
    ctx.beginPath();ctx.moveTo(x-550,116);for(const [dx,y] of [[-410,135],[-280,144],[-150,136],[0,116],[150,136],[280,144],[410,135],[550,116]])ctx.lineTo(x+dx,y);ctx.lineWidth=1.3;ctx.stroke();
  }
  const sx=1400/width,sy=750/height;
  rect(0,750*.34,1400,9*sy);rect(1400*.49,750*.34-4*sy,42*sx,17*sy);
  // Erase outside the rounded glass; do not draw a replacement scene over the camera.
  ctx.globalCompositeOperation='destination-in';ctx.beginPath();ctx.roundRect(0,0,1400,750,[26*sx,26*sx,15*sx,15*sx]);ctx.fill();
  ctx.restore();
}
