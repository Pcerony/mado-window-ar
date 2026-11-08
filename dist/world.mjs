export function random(n){let x=Math.sin(n*127.1+311.7)*43758.5453123;return x-Math.floor(x);}
export const SCENE_STARTS={inland:0,coast:10500};
function smooth(a,b,x){const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);}
export function coastAmount(distance){const d=((distance%24000)+24000)%24000;return smooth(6500,9000,d)*(1-smooth(12500,15000,d));}
export function foregroundY(distance){return 502+148*coastAmount(distance);}
export function buildingVisible(b,distance,back=false){const coast=coastAmount(distance);return random(b.id+(back?71:51))<(back?.35+b.urban*.6:.25+b.urban*.7)*(back?1-coast:1-coast*.75);}
export function district(x){const urban=(1-Math.cos(x/3300))/2;return {urban,name:urban>.72?'小都市':urban>.28?'乡间小镇':'田野之间',jp:urban>.72?'まち':urban>.28?'里山':'田園'};}
export function buildings(start,width){const out=[];for(let i=Math.floor(start/130)-2;i<Math.ceil((start+width)/130)+2;i++){let x=i*130+random(i)*44;if(x<start||x>=start+width)continue;let u=district(x).urban,r=random(i+19);out.push({id:i,x,width:62+random(i+3)*48,height:35+random(i+4)*48+(u>.6&&r>.45?u*100:0),urban:u,kind:r,color:Math.floor(random(i+8)*5)});}return out;}
export function advance(distance,dt,speed,paused){return paused?distance:distance+Math.max(0,Math.min(.05,dt))*speed*105;}
