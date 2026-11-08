import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createEncounter,encounterPose} from '../dist/encounter.mjs';
import {FERRY_INFO,FERRY_FACTS,ENCOUNTER_INFO} from '../dist/encounter-info.mjs';
const step=(event,seconds,enabled=true)=>{for(let t=0;t<seconds-.0001;t+=.05)event.update(.05,enabled);return event.snapshot()};
test('all encounters start after three to five eligible seconds, and freeze when tracking is lost',()=>{
  const e=createEncounter(()=>.5);assert.equal(step(e,3.8).phase,'waiting');
  assert.equal(step(e,20,false).phase,'waiting');
  assert.equal(step(e,.4).phase,'approach');
  const a=e.snapshot();step(e,4,false);assert.deepEqual(e.snapshot(),a);
});
test('coast alternates ferry and gull while inland only encounters the museum',()=>{
  const e=createEncounter(()=>0);assert.equal(e.snapshot().type,'ferry');step(e,15);e.dismiss();step(e,1.2);assert.equal(e.snapshot().type,'kamome');
  e.update(0,false,'inland');assert.equal(e.snapshot().type,'museum');assert.equal(e.snapshot().phase,'waiting');
  e.update(0,false,'coast');assert.equal(e.snapshot().type,'kamome');
  assert.match(ENCOUNTER_INFO.museum.rows[0][1],/太宰府/);
  assert.match(ENCOUNTER_INFO.kamome.facts[0].body,/ユリカモメ/);
});
test('ship approaches, is eaten, then the monster turns and presents facts',()=>{
  const e=createEncounter(()=>.5);step(e,4.2);assert.equal(e.snapshot().phase,'approach');
  step(e,2.2);assert.equal(e.snapshot().phase,'lift');
  step(e,1.4);assert.equal(e.snapshot().phase,'bite');
  step(e,1.2);assert.equal(e.snapshot().phase,'turn');
  step(e,1.2);assert.equal(e.snapshot().phase,'info');
  assert.equal(encounterPose(e.snapshot()).shipScale,0);
  assert.equal(encounterPose(e.snapshot()).face,1);
  step(e,50);assert.equal(e.snapshot().phase,'info');
  e.dismiss();assert.equal(e.snapshot().phase,'return');step(e,1.2);
  assert.equal(e.snapshot().phase,'waiting');assert.equal(step(e,3).phase,'waiting');
  step(e,1);assert.equal(e.snapshot().phase,'approach');
});
test('reset clears an interrupted bite, without queuing events',()=>{
  const e=createEncounter(()=>0);step(e,6.8);e.reset();assert.equal(e.snapshot().phase,'waiting');assert.equal(e.snapshot().time,0);
});
test('ship facts distinguish company illustration from specific vessels and do not invent a Fukuoka port',()=>{
  assert.equal(FERRY_INFO.fukuoka,'掲載航路では、福岡県内への寄港はありません。');
  assert.match(FERRY_INFO.ports,/別府/);assert.match(FERRY_INFO.ports,/大分/);assert.match(FERRY_INFO.ports,/志布志/);
  assert.equal(FERRY_INFO.source,'https://travel.willer.co.jp/ferry/carrier/71.html');
  assert.ok(FERRY_FACTS.length>=3);assert.ok(FERRY_FACTS.every(x=>x.title&&x.body&&x.source.startsWith('https://')));
});
