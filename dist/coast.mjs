import {random as r} from './world.mjs?v=3';
export function paintCoast(ctx,distance,amount){
  if(amount<=0)return;
  ctx.save();ctx.globalAlpha=amount;
  function path(points,fill,stroke,line=1){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));if(fill){ctx.closePath();ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=line;ctx.stroke()}}
  const rect=(x,y,w,h,color)=>{ctx.fillStyle=color;ctx.fillRect(x,y,w,h)};
  // The water replaces the distant landscape, while the coast stays in front.
  const water=ctx.createLinearGradient(0,283,0,630);water.addColorStop(0,'#82adb8');water.addColorStop(.4,'#77b4bd');water.addColorStop(1,'#99c9c5');ctx.fillStyle=water;ctx.fillRect(0,283,1400,467);
  path([[0,283],[1400,283]],null,'#d0e0d3',2);
  for(let i=Math.floor(distance*.025/590)-1;i<(distance*.025+1500)/590;i++){const x=i*590-distance*.025;path([[x,284],[x+42,273],[x+93,260],[x+135,265],[x+181,253],[x+227,277],[x+271,284]],'#9abbb7')}
  for(let row=0;row<18;row++){let y=302+row*17;for(let i=0;i<17;i++){const x=((i*101+r(row*29+i)*75-distance*(.025+row*.004))%1700+1700)%1700-140;const w=13+r(i+row*37)*58;path([[x,y],[x+w*.4,y-1.2],[x+w,y]],null,row%3?'#cee2d35c':'#e0ebdb9c',row>10?2:1)}}
  for(let i=Math.floor(distance*.08/540)-1;i<(distance*.08+1500)/540;i++){const x=i*540-distance*.08,y=342+r(i+403)*93;path([[x-19,y],[x+22,y],[x+13,y+7],[x-12,y+7]],'#eceddc');rect(x-2,y-22,2,22,'#6a8c87');path([[x,y-22],[x+16,y-3],[x,y-3]],'#f2f0da');path([[x-26,y+11],[x+31,y+11]],null,'#dce8d1',1)}
  const pierX=((1800-distance*.18)%2300+2300)%2300-400;
  path([[pierX-90,505],[pierX+165,467],[pierX+171,477],[pierX-80,518]],'#8a9e95');path([[pierX-90,503],[pierX+164,465]],null,'#d1d3bd',5);
  rect(pierX+100,397,18,79,'#e6e6d3');path([[pierX+98,397],[pierX+102,364],[pierX+115,364],[pierX+120,397]],'#eef0df');rect(pierX+99,360,19,8,'#657d76');rect(pierX+102,348,13,12,'#bdD3c7');path([[pierX+97,349],[pierX+108,339],[pierX+120,349]],'#657d76');rect(pierX+105,435,7,16,'#688c86');path([[pierX+95,398],[pierX+122,398]],null,'#718b82',2);
  path([[0,617],[300,606],[760,622],[1100,632],[1400,623],[1400,750],[0,750]],'#d6d8b6');
  path([[0,609],[300,598],[760,614],[1100,624],[1400,615]],null,'#e7edde',6);
  path([[0,617],[300,606],[760,622],[1100,632],[1400,623]],null,'#b7d8ca',3);
  rect(0,674,1400,36,'#abb9ac');rect(0,672,1400,4,'#e2e1c8');
  for(let i=Math.floor(distance*.8/130)-1;i<(distance*.8+1500)/130;i++){let x=i*130-distance*.8;rect(x,691,62,2,'#e6e6cb');rect(x,648,3,23,'#a5b6a4')}
  path([[0,653],[1400,653]],null,'#c9d2bb',3);
  for(let i=0;i<4;i++){let x=((i*431-distance*.04)%1800+1800)%1800-150,y=198+r(i+91)*52;path([[x-8,y+2],[x-3,y],[x,y+3],[x+5,y],[x+10,y+1]],null,'#f5f3df',1.4)}
  ctx.restore();
}
