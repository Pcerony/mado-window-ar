import {test} from 'node:test';
import assert from 'node:assert/strict';
import {MONSTER_SCALE,monsterPose} from '../dist/monster-layout.mjs';
test('larger monster keeps head and full tail inside the glass',()=>{
  assert.ok(MONSTER_SCALE>=51*1.8);
  for(let d=0;d<24000;d+=50){const {x,y}=monsterPose(d);assert.ok(375-(y+5.2*MONSTER_SCALE)>0);assert.ok(700+x-5*MONSTER_SCALE>0);assert.ok(700+x+1.5*MONSTER_SCALE<1400)}
});
