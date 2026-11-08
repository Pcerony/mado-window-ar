import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {requestCamera,cameraErrorMessage} from '../dist/camera.mjs';
test('plain HTTP domain is upgraded before camera code executes',()=>{
  const run=href=>{let replacement=null;vm.runInNewContext(readFileSync(new URL('../dist/secure-entry.js',import.meta.url),'utf8'),{URL,location:{href,replace:v=>replacement=v}});return replacement};
  assert.equal(run('http://armado.heisei.space/?w=1000&h=500'),'https://armado.heisei.space/?w=1000&h=500');
  assert.equal(run('https://armado.heisei.space/'),null);assert.equal(run('http://localhost:4178/'),null);
});
test('camera request occurs immediately and only constraint failures get a fallback',async()=>{
  const calls=[];const media={getUserMedia:options=>{calls.push(options);return calls.length===1?Promise.reject({name:'OverconstrainedError'}):Promise.resolve('stream')}};
  const result=requestCamera(media,'environment');assert.equal(calls.length,1);assert.equal(await result,'stream');assert.equal(calls.length,2);
  let denied=0;await assert.rejects(requestCamera({getUserMedia:()=>{denied++;return Promise.reject({name:'NotAllowedError'})}},'environment'));
  assert.equal(denied,1);
  assert.match(cameraErrorMessage('NotAllowedError','CriOS/1'),/Chrome/);assert.doesNotMatch(cameraErrorMessage('InsecureContext','Chrome/1'),/Safari/);
});
