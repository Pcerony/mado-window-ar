async (page) => {
  await page.setViewportSize({width:1280,height:800});
  await page.goto('http://localhost:4178/screen.html?ar');
  await page.getByRole('button',{name:'暂停',exact:true}).click();
  await page.waitForSelector('.ar-marker svg');
  await page.screenshot({path:'output/playwright/mac-ar-screen.png'});
  await page.locator('#scene').selectOption('coast');
  await page.waitForFunction(()=>document.querySelector('#landscape').dataset.coast==='1.000');
  await page.screenshot({path:'output/playwright/mac-coast-screen.png'});
  const source=(await page.screenshot()).toString('base64');
  await page.setViewportSize({width:844,height:390});
  await page.goto('http://localhost:4178/');
  await page.evaluate(async(source)=>{
    const image=new Image();image.src='data:image/png;base64,'+source;await image.decode();
    const input=document.createElement('canvas');input.width=1280;input.height=720;
    const ctx=input.getContext('2d');window.qaInput=input;window.qaImage=image;
    window.qaDraw=()=>{ctx.fillStyle='#263329';ctx.fillRect(0,0,1280,720);ctx.drawImage(image,128,40,1024,640)};
    window.qaDraw();window.qaTimer=setInterval(()=>window.qaDraw(),50);
    navigator.mediaDevices.getUserMedia=async()=>input.captureStream(20);
  },source);
  await page.getByRole('button',{name:'カメラを起動',exact:true}).click();
  await page.waitForFunction(()=>document.body.classList.contains('locked'),{timeout:20000});
  await page.screenshot({path:'output/playwright/iphone-ar-tracked.png'});
  const result=await page.evaluate(()=>{
    const c=document.querySelector('#creature'),data=c.getContext('2d').getImageData(0,0,1400,750).data;
    let pixels=0;for(let i=3;i<data.length;i+=4)if(data[i])pixels++;
    return {status:document.querySelector('#tracking-text').textContent,markers:document.querySelector('#scan-count').textContent,creaturePixels:pixels,overflow:document.documentElement.scrollWidth>innerWidth,transform:document.querySelector('#projection').style.transform};
  });
  if(result.creaturePixels<1000||result.overflow)throw new Error(JSON.stringify(result));
  await page.evaluate(()=>{window.qaDraw=()=>{const c=window.qaInput,x=c.getContext('2d');x.fillStyle='#263329';x.fillRect(0,0,c.width,c.height)}});
  await page.waitForFunction(()=>!document.body.classList.contains('locked'));
  if(await page.locator('#projection').evaluate(e=>getComputedStyle(e).opacity)!=='0')throw new Error('Lost tracking left a creature visible');
  await page.getByRole('button',{name:'カメラを停止',exact:true}).click();
  await page.getByRole('button',{name:'カメラを起動',exact:true}).waitFor({state:'visible'});
  return {...result,lostTrackingHides:true,cameraStop:true};
}
