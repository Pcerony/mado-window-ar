async (page) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('http://localhost:4178/');
  if(!await page.locator('#camera').count())throw Error('Home is not the phone app');
  await page.getByRole('button',{name:'カメラを起動',exact:true}).waitFor();
  await page.evaluate(()=>{window.cameraCalls=0;navigator.mediaDevices.getUserMedia=async()=>{window.cameraCalls++;throw Object.assign(new Error(),{name:'NotAllowedError'})}});
  await page.getByRole('button',{name:'カメラを起動',exact:true}).click();
  await page.getByRole('button',{name:'もう一度試す',exact:true}).waitFor();
  if(await page.locator('#rotate-device').count())throw Error('Orientation gate exists');
  if(await page.evaluate(()=>window.cameraCalls)!==1)throw Error('Camera was not requested exactly once');
  if(!(await page.locator('#camera-message').textContent()).includes('Chrome'))throw Error('Wrong permission instructions for Chrome');
  await page.goto('http://localhost:4178/ar.html?w=987&h=456');
  await page.waitForURL('**/?w=987&h=456');
  await page.setViewportSize({width:1920,height:1080});
  await page.goto('http://localhost:4178/screen.html?scene=coast');
  if(await page.locator('.ar-marker:visible').count()!==4)throw Error('Screen does not show tracking markers by default');
  if(await page.locator('#room-join').count())throw Error('Persistent room QR still exists');
  await page.getByRole('button',{name:'连接 iPhone',exact:true}).click();
  await page.addScriptTag({path:'/Users/heisei/Library/CloudStorage/OneDrive-个人/Desktop/vivitstop/train-window/node_modules/jsqr/dist/jsQR.js'});
  const decoded=await page.evaluate(()=>{const c=document.querySelector('#phone-qr'),p=c.getContext('2d').getImageData(0,0,c.width,c.height);return jsQR(p.data,c.width,c.height)?.data});
  if(!decoded?.startsWith('https://armado.heisei.space/?'))throw Error('Popup QR does not target secure phone entry');
  await page.getByRole('button',{name:'关闭',exact:true}).click();
  await page.screenshot({path:'output/playwright/screen-without-room-qr.png'});
  return {rootPhone:true,noOrientationGate:true,ChromePermissionPromptPath:true,legacyLinkPreserved:true,persistentQRRemoved:true,popupQR:decoded};
}
