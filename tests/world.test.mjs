import {test} from 'node:test';
import assert from 'node:assert/strict';
import {random, district, buildings, advance, coastAmount, SCENE_STARTS, foregroundY, buildingVisible} from '../dist/world.mjs';
test('world generation is stable and does not repeat adjacent districts',()=>{
  assert.equal(random(42),random(42));
  assert.notEqual(random(42),random(43));
  assert.ok(random(-100)>=0 && random(-100)<1);
  assert.equal(district(0).urban,0);
  const a=buildings(0,1400),b=buildings(200,1400);
  assert.deepEqual(a.filter(x=>x.x>=200),b.filter(x=>x.x<1400));
  assert.notDeepEqual(buildings(10000,1000).map(x=>x.height),buildings(20000,1000).map(x=>x.height));
});
test('coastal route is directly reachable and blends continuously with inland',()=>{
  assert.equal(coastAmount(SCENE_STARTS.inland),0);
  assert.equal(coastAmount(SCENE_STARTS.coast),1);
  assert.equal(foregroundY(SCENE_STARTS.coast),650);
  assert.equal(foregroundY(0),502);
  for(let d=0;d<50000;d+=53){assert.ok(coastAmount(d)>=0&&coastAmount(d)<=1);assert.ok(Math.abs(coastAmount(d+.01)-coastAmount(d))<.001)}
  assert.equal(buildingVisible({id:0,urban:1},SCENE_STARTS.coast,true),false);
});
test('pause freezes distance and hidden-tab delta is bounded',()=>{
  assert.equal(advance(20,1,1,true),20);
  assert.equal(advance(20,1,0,false),20);
  assert.equal(advance(20,1000,1,false),advance(20,.05,1,false));
  assert.ok(advance(20,.016,2,false)>advance(20,.016,1,false));
});
