import {test} from 'node:test';
import assert from 'node:assert/strict';
import {encodeDistance,decodeDistance,decodeFrame,markerQuad,trackingVisible,readCode,cssMatrix,CODE} from '../dist/ar-core.mjs';
test('optical frame round trips distance and rejects a corrupted bit',()=>{
  for(const distance of [0,1.25,123.456,4000000])assert.ok(Math.abs(decodeDistance(encodeDistance(distance))-distance)<.251);
  const bits=encodeDistance(384);bits[17]^=1;assert.equal(decodeDistance(bits),null);
  assert.equal(decodeDistance([]),null);
  assert.equal(encodeDistance(0).length,CODE.bits);
});
test('the optical strip also synchronizes window geometry for the shared room QR',()=>{
  const data=decodeFrame(encodeDistance(10500,876,424));assert.deepEqual(data,{distance:10500,width:876,height:424});
});
test('four identified markers form a consistently ordered screen quad',()=>{
  const mark=(id,x,y)=>({id,corners:[{x:x-5,y:y-5},{x:x+5,y:y-5},{x:x+5,y:y+5},{x:x-5,y:y+5}]});
  const a=[mark(12,10,10),mark(13,310,20),mark(14,300,200),mark(15,15,210)];
  assert.deepEqual(markerQuad(a.reverse()),[10,10,310,20,300,200,15,210]);
  assert.equal(markerQuad(a.slice(1)),null);
  assert.equal(markerQuad([mark(12,0,0),mark(13,0,0),mark(14,0,0),mark(15,0,0)]),null);
});
test('lost or stale optical tracking never leaves a floating creature',()=>{
  assert.equal(trackingVisible(1000,900,900),true);
  assert.equal(trackingVisible(1000,700,900),false);
  assert.equal(trackingVisible(1000,900,0),false);
});
test('optical sampler reads camera pixels and rejects a low contrast frame',()=>{
  const width=1400,height=750,data=new Uint8ClampedArray(width*height*4),bits=encodeDistance(3982.25);
  for(let y=CODE.y;y<CODE.y+CODE.height;y++)for(let x=CODE.x;x<CODE.x+CODE.width;x++){
    const b=bits[Math.floor((x-CODE.x)/(CODE.width/CODE.bits))],k=(y*width+x)*4;
    data[k]=data[k+1]=data[k+2]=b?220:25;data[k+3]=255;
  }
  assert.equal(readCode({width,height,data},{transform:(x,y)=>[x,y]}),3982.25);
  data.fill(90);assert.equal(readCode({width,height,data},{transform:(x,y)=>[x,y]}),null);
  assert.equal(cssMatrix([1,0,10,0,1,20,0,0]),'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,10,20,0,1)');
});
