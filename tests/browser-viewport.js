async (page) => {
  await page.setViewportSize({width:1280,height:800});
  await page.goto('http://localhost:4178/screen.html?scene=coast');
  await page.getByRole('button',{name:'暂停',exact:true}).click();
  const sourceBox=await page.locator('#landscape').boundingBox(),source=(await page.screenshot()).toString('base64');
  await page.setViewportSize({width:844,height:390});
  await page.goto('http://localhost:4178/');
  await page.evaluate(async(source)=>{
    const image=new Image();image.src='data:image/png;base64,'+source;await image.decode();
    const c=document.createElement('canvas');c.width=1280;c.height=720;const x=c.getContext('2d');
    const draw=()=>{x.fillStyle='#263329';x.fillRect(0,0,1280,720);x.drawImage(image,128,40,1024,640)};
    draw();setInterval(draw,50);navigator.mediaDevices.getUserMedia=async()=>c.captureStream(20);
    const viewport={width:760,height:294,offsetLeft:0,offsetTop:0};window.qaViewport=viewport;
    Object.defineProperty(window,'visualViewport',{configurable:true,value:viewport});window.dispatchEvent(new Event('resize'));
  },source);
  await page.getByRole('button',{name:'カメラを起動',exact:true}).click();
  await page.waitForFunction(()=>document.body.classList.contains('locked'));
  async function check(){
    return await page.evaluate((sourceBox)=>{
      const stage=document.querySelector('#ar-app').getBoundingClientRect(),v=document.querySelector('#camera').getBoundingClientRect();
      const scale=Math.max(v.width/1280,v.height/720),dx=(v.width-1280*scale)/2,dy=(v.height-720*scale)/2;
      const expected={x:(128+sourceBox.x*.8)*scale+dx,y:(40+sourceBox.y*.8)*scale+dy};
      const actual=new DOMMatrix(getComputedStyle(document.querySelector('#projection')).transform).transformPoint(new DOMPoint(0,0));
      return {stage:[stage.width,stage.height],video:[v.width,v.height],projectionError:Math.hypot(actual.x-expected.x,actual.y-expected.y)};
    },sourceBox);
  }
  const first=await check();
  if(first.stage[0]!==760||first.stage[1]!==294||first.projectionError>3)throw Error(JSON.stringify(first));
  await page.screenshot({path:'output/playwright/visible-viewport-crop.png',clip:{x:0,y:0,width:760,height:294}});
  await page.evaluate(()=>{window.qaViewport.width=844;window.qaViewport.height=360;window.dispatchEvent(new Event('resize'))});
  await page.waitForFunction(()=>document.body.classList.contains('locked'));
  const second=await check();
  if(second.stage[0]!==844||second.stage[1]!==360||second.projectionError>3)throw Error(JSON.stringify(second));
  await page.getByRole('button',{name:'カメラを停止',exact:true}).click();
  return {staleInnerViewport:[844,390],first,second,noRotationGate:await page.locator('#rotate-device').count()===0};
}
