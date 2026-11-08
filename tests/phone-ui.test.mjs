import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('phone is Japanese, landscape-first and does not require orientation lock support',()=>{
  const html=readFileSync(new URL('../dist/ar.html',import.meta.url),'utf8');
  const js=readFileSync(new URL('../dist/ar.mjs',import.meta.url),'utf8');
  assert.match(html,/<html lang="ja"/);assert.match(html,/横向きにしてください/);
  for(const word of ['开启','关闭','相机','寻找','允许','读取','重试','窗外来客','摄像头','无法','切换'])assert.ok(!html.includes(word)&&!js.includes(word),word);
  const manifest=JSON.parse(readFileSync(new URL('../dist/manifest.webmanifest',import.meta.url),'utf8'));
  assert.equal(manifest.orientation,'landscape');
});
