import {test} from 'node:test';
import assert from 'node:assert/strict';
import {random, district, buildings, advance} from '../dist/world.mjs';
test('world generation is stable and does not repeat adjacent districts',()=>{
  assert.equal(random(42),random(42));
  assert.notEqual(random(42),random(43));
  assert.ok(random(-100)>=0 && random(-100)<1);
  assert.equal(district(0).urban,0);
  const a=buildings(0,1400),b=buildings(200,1400);
  assert.deepEqual(a.filter(x=>x.x>=200),b.filter(x=>x.x<1400));
  assert.notDeepEqual(buildings(10000,1000).map(x=>x.height),buildings(20000,1000).map(x=>x.height));
});
test('pause freezes distance and hidden-tab delta is bounded',()=>{
  assert.equal(advance(20,1,1,true),20);
  assert.equal(advance(20,1,0,false),20);
  assert.equal(advance(20,1000,1,false),advance(20,.05,1,false));
  assert.ok(advance(20,.016,2,false)>advance(20,.016,1,false));
});
