// npm dependencies for the browser are isolated from the app. See review README.
import { createRequire } from 'node:module';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import path from 'node:path';
const require = createRequire(process.env.REVIEW_BROWSER_PACKAGE || '/workspace/workshop-browser/package.json');
const { chromium } = require('playwright-core');
const chromiumModule = require('@sparticuz/chromium');
const packagedChromium = chromiumModule.default || chromiumModule;
const runFile = promisify(execFile);
const origin = process.env.REVIEW_ORIGIN || 'http://127.0.0.1:5173';
const out = path.resolve(process.env.REVIEW_OUT || 'work/captures');
await mkdir(out, { recursive: true });
const viewport = {width:Number(process.env.REVIEW_WIDTH || (process.env.REVIEW_ONLY==='desktop'?1440:390)),height:Number(process.env.REVIEW_HEIGHT || (process.env.REVIEW_ONLY==='desktop'?1000:844))};
const mobile = viewport.width <= 700;
const browser = await chromium.launch({executablePath:await packagedChromium.executablePath(),headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage','--font-render-hinting=none','--single-process','--in-process-gpu','--no-zygote']});
const report = {viewport,browser:await browser.version(),method:'Source imported by review-only entry; genuine UI actions followed by production-simulation endpoint seeking and a settled source camera. No timing/FPS claim.',screenshots:[],errors:[]};
const fontBuffers=new Map();let fontCSS='';
try {
 const context = await browser.newContext({viewport,deviceScaleFactor:1,isMobile:mobile,hasTouch:mobile});
 await context.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//, async route => {
  const {stdout} = await runFile('curl',['--fail','--silent','--show-error','--location','--max-time','30',route.request().url()],{encoding:'buffer',maxBuffer:10*1024*1024});
  if(route.request().url().startsWith('https://fonts.googleapis.com/'))fontCSS+=stdout.toString('utf8');
  else fontBuffers.set(route.request().url(),stdout.toString('base64'));
  await route.fulfill({status:200,body:stdout,contentType:route.request().url().startsWith('https://fonts.googleapis.com/')?'text/css':'font/woff2'});
 });
 const page = await context.newPage();
 page.on('pageerror',e=>report.errors.push(e.message));
 await page.goto(origin+'/scripts/review.html',{waitUntil:'networkidle',timeout:60000});
 await page.waitForFunction(()=>window.__reviewRoots?.size && document.querySelector('canvas')?.width);
 await page.evaluate(async()=>{await document.fonts.ready;});
 // Reuse exact downloaded font bytes as FontFace buffers. Software Chromium can
 // intermittently omit numeral glyphs from URL-backed faces during capture.
 const faces=[...fontCSS.matchAll(/@font-face\s*\{([^}]+)\}/g)].flatMap(([,block])=>{
  const prop=name=>block.match(new RegExp(name+':\\s*([^;]+)'))?.[1].trim();
  const url=prop('src')?.match(/url\(['"]?([^)'"\s]+)/)?.[1],data=fontBuffers.get(url);
  return data?[{family:prop('font-family').replace(/['"]/g,''),weight:prop('font-weight')||'400',range:prop('unicode-range')||'U+0-10FFFF',data}]:[];
 });
 assert(faces.length>0,'Downloaded font buffers must be available');
 await page.evaluate(async faces=>{
  for(const font of [...document.fonts])document.fonts.delete(font);
  for(const source of faces){const bytes=Uint8Array.from(atob(source.data),c=>c.charCodeAt(0));const face=new FontFace(source.family,bytes.buffer,{weight:source.weight,unicodeRange:source.range,style:'normal'});document.fonts.add(await face.load());}
  await document.fonts.ready;
 },faces);
 report.fontLoading='Exact downloaded Google font bytes loaded as FontFace buffers for reliable software capture.';
 await page.waitForTimeout(1500);
 report.fonts = await page.evaluate(()=>[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family));
 assert(report.fonts.some(f=>f.includes('DM Sans')) && report.fonts.some(f=>f.includes('IBM Plex Mono')));
 await page.evaluate(()=>{
  const host=document.querySelector('.workshop');
  const key=Object.keys(host).find(k=>k.startsWith('__reactFiber$'));
  for(let f=host[key];f;f=f.return){for(let h=f.memoizedState;h;h=h.next){const v=h.memoizedState?.current;if(v&&typeof v.motorAngle==='number'){window.__reviewSim=v;break;}}if(window.__reviewSim)break;}
  const store=[...window.__reviewRoots.values()][0].store;
  window.__reviewStore=store;
  const setFrameloop=store.getState().setFrameloop;
  store.setState({setFrameloop:()=>setFrameloop('never')});
  setFrameloop('never');
 });
 report.renderer = await page.locator('canvas').evaluate(c=>{const gl=c.getContext('webgl2'),ext=gl.getExtension('WEBGL_debug_renderer_info');return gl.getParameter(ext?.UNMASKED_RENDERER_WEBGL || gl.RENDERER);});
 async function shot(name,inspection=false,powered=false){
  if(process.env.REVIEW_CAPTURE_ONLY && process.env.REVIEW_CAPTURE_ONLY!==name)return;
  const state=await page.evaluate(({inspection,powered})=>{
   const s=window.__reviewSim,r=window.__reviewStore.getState();
   s.held=powered;
   for(let i=0;i<240;i++)window.__reviewAdvanceSimulation(s,.05,{inspection,reduced:false,now:performance.now()+i*50});
   // Let the source camera settle by invoking only its simulation/camera subscriber.
   for(let i=0;i<160;i++)for(const sub of r.internal.subscribers.filter(x=>x.priority===-2))sub.ref.current(r,.05);
   // Render callbacks place geometry and schedule production shadow updates.
   r.advance(r.clock.elapsedTime+.05,true);
   r.advance(r.clock.elapsedTime+.05,true);
   const box=sel=>{const b=document.querySelector(sel)?.getBoundingClientRect();return b?{x:b.x,y:b.y,width:b.width,height:b.height}:null;};
   const projected={left:Infinity,right:-Infinity,top:Infinity,bottom:-Infinity};
   const point=r.camera.position.clone(),rect=document.querySelector('canvas').getBoundingClientRect();
   r.scene.getObjectByName('exhibit')?.traverse(mesh=>{
    if(!mesh.isMesh||mesh.renderOrder===5)return;
    for(let parent=mesh;parent;parent=parent.parent)if(!parent.visible)return;
    const positions=mesh.geometry.attributes.position;
    for(let i=0;i<positions.count;i++){
     point.fromBufferAttribute(positions,i).applyMatrix4(mesh.matrixWorld).project(r.camera);
     const x=rect.x+(point.x+1)*rect.width/2,y=rect.y+(1-point.y)*rect.height/2;
     projected.left=Math.min(projected.left,x);projected.right=Math.max(projected.right,x);projected.top=Math.min(projected.top,y);projected.bottom=Math.max(projected.bottom,y);
    }
   });
   return {simulation:{...s},camera:r.camera.position.toArray(),scene:box('.scene'),detail:box('.part-detail'),dock:box('.control-dock'),projectedGeometry:projected,documentHeight:document.documentElement.scrollHeight,overflow:document.documentElement.scrollWidth>innerWidth};
  },{inspection,powered});
  await page.waitForTimeout(200);
  const file=(mobile?'mobile-'+viewport.width:'desktop')+'-'+name+'.png';
  console.log(JSON.stringify({file,...state}));
  // Render inside a browser frame and finish GPU commands before compositor capture.
  // This is test synchronization, not a production animation/shadow override.
  state.centerPixel=await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>{
   const r=window.__reviewStore.getState();r.advance(r.clock.elapsedTime+.05,true);
   const gl=r.gl.getContext();gl.finish();const pixel=new Uint8Array(4);
   gl.readPixels(Math.floor(gl.drawingBufferWidth/2),Math.floor(gl.drawingBufferHeight/2),1,1,gl.RGBA,gl.UNSIGNED_BYTE,pixel);
   resolve([...pixel]);
  })));
  state.powerText=await page.locator('.power-heading strong').innerText();
  // A separate paint layer keeps Chromium's software WebGL compositor from
  // dropping glyphs in the neighboring numeric DOM label. No visible transform.
  await page.locator('.power-heading strong').evaluate(el=>{el.style.willChange='transform';el.style.transform='translateZ(0)';});
  // CDP clips the document without changing viewport height (and hence svh).
  // Playwright fullPage resizing can repeatedly relayout a mobile flow page.
  const cdp=await context.newCDPSession(page);
  const {data}=await cdp.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,fromSurface:true,clip:{x:0,y:0,width:viewport.width,height:state.documentHeight,scale:1}});
  await writeFile(path.join(out,file),Buffer.from(data,'base64'));
  await cdp.detach();
  assert(!state.overflow);assert.equal(state.simulation.explode,Number(inspection));
  if(Number.isFinite(state.projectedGeometry.left)){
   assert(state.projectedGeometry.left>=8 && state.projectedGeometry.right<=viewport.width-8,'Geometry must fit with horizontal margins');
   assert(state.projectedGeometry.bottom<=(mobile?state.scene.y+state.scene.height:state.dock.y)-8,'Geometry must clear scene edge/control dock');
  }
  report.screenshots.push({file,...state}); console.log('captured '+file);
 }
 await shot('idle');
 await page.locator('body').click({position:{x:5,y:5}});
 await page.keyboard.down('Space'); await shot('powered',false,true); await page.keyboard.up('Space');
 await page.getByRole('button',{name:'Inspect motor',exact:true}).click();
 await page.getByRole('button',{name:'Reassemble',exact:true}).waitFor();
 await page.waitForTimeout(200);await shot('exploded',true);
 await page.getByRole('button',{name:'Output shaft',exact:false}).click();
 await page.waitForTimeout(200);await shot('shaft-selected',true);
 assert.deepEqual(report.errors,[]);
} finally {
 await writeFile(path.join(out,(mobile?'mobile-'+viewport.width:'desktop')+'-checks.json'),JSON.stringify(report,null,2));
 await browser.close();
}
