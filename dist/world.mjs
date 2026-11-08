export function random(n){let x=Math.sin(n*127.1+311.7)*43758.5453123;return x-Math.floor(x);}
export function district(x){const urban=(1-Math.cos(x/3300))/2;return {urban,name:urban>.72?'小都市':urban>.28?'乡间小镇':'田野之间',jp:urban>.72?'まち':urban>.28?'里山':'田園'};}
export function buildings(start,width){const out=[];for(let i=Math.floor(start/130)-2;i<Math.ceil((start+width)/130)+2;i++){let x=i*130+random(i)*44;if(x<start||x>=start+width)continue;let u=district(x).urban,r=random(i+19);out.push({id:i,x,width:62+random(i+3)*48,height:35+random(i+4)*48+(u>.6&&r>.45?u*100:0),urban:u,kind:r,color:Math.floor(random(i+8)*5)});}return out;}
export function advance(distance,dt,speed,paused){return paused?distance:distance+Math.max(0,Math.min(.05,dt))*speed*105;}
