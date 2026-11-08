export function visibleSize(viewport,fallback){return {width:viewport?.width>0?viewport.width:fallback.width,height:viewport?.height>0?viewport.height:fallback.height,left:viewport?.offsetLeft||0,top:viewport?.offsetTop||0};}
export function videoProjection(width,height,video,stage){const scale=Math.max(video.width/width,video.height/height);return {scale,dx:video.left-stage.left+(video.width-width*scale)/2,dy:video.top-stage.top+(video.height-height*scale)/2};}
export function bindViewport(stage){
  function update(){const size=visibleSize(window.visualViewport,{width:document.documentElement.clientWidth||innerWidth,height:innerHeight});
    document.documentElement.style.setProperty('--view-width',size.width+'px');document.documentElement.style.setProperty('--view-height',size.height+'px');
    stage.style.width=size.width+'px';stage.style.height=size.height+'px';stage.style.left=size.left+'px';stage.style.top=size.top+'px';
  }
  update();window.addEventListener('resize',update);window.visualViewport?.addEventListener('resize',update);window.visualViewport?.addEventListener('scroll',update);
}
