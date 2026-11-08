import {test} from 'node:test';
import assert from 'node:assert/strict';
import {visibleSize,videoProjection} from '../dist/viewport.mjs';
test('camera stage follows the actual visual viewport rather than stale orientation dimensions',()=>{
  assert.deepEqual(visibleSize({width:760,height:294,offsetLeft:0,offsetTop:0},{width:844,height:390}),{width:760,height:294,left:0,top:0});
  assert.deepEqual(visibleSize(null,{width:390,height:700}),{width:390,height:700,left:0,top:0});
});
test('AR projection uses the displayed video rectangle and stage origin',()=>{
  const p=videoProjection(960,540,{left:30,top:50,width:600,height:300},{left:10,top:20});
  assert.equal(p.scale,.625);assert.equal(p.dx,20);assert.equal(p.dy,11.25);
  const portrait=videoProjection(1280,720,{left:0,top:0,width:390,height:844},{left:0,top:0});
  assert.equal(portrait.scale,844/720);assert.ok(Math.abs(portrait.dx-(390-1280*844/720)/2)<1e-9);assert.equal(portrait.dy,0);
});
