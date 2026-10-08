import {chromium as playwright} from '/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core/index.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';

const taskRoot='/workspace/scratch/1677153ed499';
const dist=path.join(taskRoot,'.sites-checkout/dist');
const qaDist=path.join(taskRoot,'review-runtime/qa-build');
const out=path.join(taskRoot,'portfolio-visual-review');
const origin='http://terminal.local:4173';
const fontRoot=path.join(taskRoot,'review-runtime/node_modules');
const fonts={
 'dm-sans.woff2':path.join(fontRoot,'@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2'),
 'dm-sans-ext.woff2':path.join(fontRoot,'@fontsource-variable/dm-sans/files/dm-sans-latin-ext-wght-normal.woff2'),
 'plex-400.woff2':path.join(fontRoot,'@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2'),
 'plex-500.woff2':path.join(fontRoot,'@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2'),
};
let fontCSS=`@font-face{font-family:'DM Sans';font-style:normal;font-weight:100 1000;src:url('${origin}/__review-fonts/dm-sans-ext.woff2') format('woff2');font-display:swap;unicode-range:U+0100-02FF;}@font-face{font-family:'DM Sans';font-style:normal;font-weight:100 1000;src:url('${origin}/__review-fonts/dm-sans.woff2') format('woff2');font-display:swap;unicode-range:U+0000-00FF,U+2000-206F;}@font-face{font-family:'IBM Plex Mono';font-style:normal;font-weight:400;src:url('${origin}/__review-fonts/plex-400.woff2') format('woff2');font-display:swap;}@font-face{font-family:'IBM Plex Mono';font-style:normal;font-weight:500;src:url('${origin}/__review-fonts/plex-500.woff2') format('woff2');font-display:swap;}`;
for(const [name,file] of Object.entries(fonts))fontCSS=fontCSS.replace(`${origin}/__review-fonts/${name}`,`data:font/woff2;base64,${(await fs.readFile(file)).toString('base64')}`);
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.jfif':'image/jpeg','.woff2':'font/woff2','.webm':'video/webm','.mp4':'video/mp4','.pdf':'application/pdf'};
await fs.mkdir(out,{recursive:true});
const browser=await playwright.launch({executablePath:process.env.REVIEW_CHROMIUM_PATH,headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage','--font-render-hinting=none','--single-process','--in-process-gpu','--no-zygote']});
const report={sourceCommit:'35c78c727a1daf653d7119645326528f6fb2f1cd',publishedVersion:1,delivery:'Review build imports the published source plus a test-only bridge to the existing R3F renderer and production simulation. Live URL unavailable to test browser. Geometry, materials, lighting and CSS unchanged; same named fonts supplied from Fontsource packages. Animation endpoints are sought using the production simulation function and rendered with its settled camera for repeatable stills. Not a hardware-performance test.',browser:await browser.version(),screenshots:[],checks:[],errors:[],blockedRequests:[]};
async function makePage(viewport,mobile=false){
 const context=await browser.newContext({viewport,deviceScaleFactor:1,isMobile:mobile,hasTouch:mobile});
 await context.route('**/*',async route=>{
  const url=new URL(route.request().url());
  try{
   if(url.hostname==='fonts.googleapis.com'){return route.fulfill({status:200,contentType:'text/css',body:'/* Exact named fonts are supplied as local FontFace buffers for review. */'});}
   if(url.origin!==origin){report.blockedRequests.push(url.origin+url.pathname);return route.abort();}
   if(url.pathname.startsWith('/__review-fonts/')){const f=fonts[path.basename(url.pathname)];if(!f)return route.abort();return route.fulfill({status:200,contentType:'font/woff2',body:await fs.readFile(f)});}
   const pathname=decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname);
   let file=path.resolve(qaDist,'.'+pathname);
   try{await fs.access(file);}catch{file=path.resolve(dist,'.'+pathname);}
   if(!file.startsWith(dist+path.sep)&&!file.startsWith(qaDist+path.sep))return route.abort();
   return route.fulfill({status:200,contentType:mime[path.extname(file)]||'application/octet-stream',body:await fs.readFile(file)});
  }catch(error){return route.fulfill({status:404,body:'Not found'});}
 });
 const page=await context.newPage();
 page.on('console',msg=>{if(msg.type()==='error')console.log('browser: '+msg.text());});
 page.on('pageerror',error=>report.errors.push({viewport,error:error.message}));
 await page.goto(origin+'/',{waitUntil:'load'});
 await page.getByRole('button',{name:'Hold to turn',exact:true}).waitFor({state:'visible',timeout:30000});
 const embeddedFonts=await Promise.all([
  ['DM Sans','100 1000','dm-sans-ext.woff2','U+0100-02FF'],['DM Sans','100 1000','dm-sans.woff2','U+0000-00FF,U+2000-206F'],['IBM Plex Mono','400','plex-400.woff2','U+0-10FFFF'],['IBM Plex Mono','500','plex-500.woff2','U+0-10FFFF']
 ].map(async([family,weight,name,range])=>({family,weight,range,data:(await fs.readFile(fonts[name])).toString('base64')})));
 await page.evaluate(async fonts=>{
  for(const font of [...document.fonts])document.fonts.delete(font);
  for(const source of fonts){
   const bytes=Uint8Array.from(atob(source.data),c=>c.charCodeAt(0));
   const face=new FontFace(source.family,bytes.buffer,{weight:source.weight,style:'normal',display:'swap',unicodeRange:source.range});
   document.fonts.add(await face.load());
  }
  await document.fonts.ready;
 },embeddedFonts);
 console.log(JSON.stringify({fonts:await page.evaluate(()=>[...document.fonts].map(f=>({family:f.family,status:f.status,weight:f.weight,range:f.unicodeRange}))),text:await page.locator('h1').innerText()}));
 await page.waitForFunction(()=>document.querySelector('.scene canvas')?.width>0&&!document.querySelector('.scene-fallback'));
 await page.waitForTimeout(1800);
 await page.evaluate(()=>{
  const host=document.querySelector('.workshop');
  const key=Object.keys(host).find(k=>k.startsWith('__reactFiber$'));
  for(let fiber=host[key];fiber;fiber=fiber.return){
   for(let hook=fiber.memoizedState;hook;hook=hook.next){
    const value=hook.memoizedState?.current;
    if(value&&typeof value.motorAngle==='number'&&typeof value.explode==='number'){window.__reviewSim=value;break;}
   }
   if(window.__reviewSim)break;
  }
  const store=[...window.__reviewRoots.values()][0].store;
  const setFrameloop=store.getState().setFrameloop;
  store.setState({setFrameloop:()=>setFrameloop('never')});
  store.getState().setFrameloop('never');
  window.__reviewRoot=store.getState();
 });
 const info=await page.evaluate(()=>{
  const c=document.createElement('canvas'),gl=c.getContext('webgl2');const ext=gl?.getExtension('WEBGL_debug_renderer_info');
  const renderer=ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):null;gl?.getExtension('WEBGL_lose_context')?.loseContext();
  return {viewport:{width:innerWidth,height:innerHeight},webgl2:!!gl,renderer,font:document.fonts.check('450 20px "DM Sans"'),canvas:{width:document.querySelector('canvas').width,height:document.querySelector('canvas').height},overflow:document.documentElement.scrollWidth>innerWidth};
 });
 report.checks.push({name:'render-ready',...info});console.log(JSON.stringify({event:'render-ready',...info}));
 return {page,context};
}
async function shot(page,name){
 await page.evaluate(()=>{
  const r=window.__reviewRoot,s=window.__reviewSim,mobile=innerWidth<=700,e=s.explode;
  const factor=1+e*(mobile?.07:.18);
  r.camera.position.set((mobile?4.6:5.8)*factor,(mobile?3.5:4.1)*factor,9*factor);
  r.camera.lookAt(mobile?-.25:-.1,1.33,.15+e*.07);
  r.gl.shadowMap.needsUpdate=true;
  for(let i=0;i<3;i++)r.advance(r.clock.elapsedTime+.05,true);
 });
 await page.waitForTimeout(250);
 await page.screenshot({path:path.join(out,name+'.png'),fullPage:true,timeout:90000});
 report.screenshots.push({name,viewport:page.viewportSize(),power:await page.locator('.power-heading strong').innerText(),simulation:await page.evaluate(()=>({...window.__reviewSim})),capture:'Production simulation sought to a repeatable state; existing renderer advanced manually with its settled camera'});
 console.log('captured '+name);
}
async function seek(page,inspection,steps=220){await page.evaluate(({inspection,steps})=>{for(let i=0;i<steps;i++)window.__reviewAdvanceSimulation(window.__reviewSim,.05,{inspection,reduced:false,now:performance.now()+i*50});},{inspection,steps});}
async function committed(page,inspection){await page.waitForFunction(inspection=>{
 const stack=[[...window.__reviewRoots.values()][0].fiber.current];
 while(stack.length){const f=stack.pop();if(!f)continue;if(typeof f.memoizedProps?.onTelemetry==='function'&&f.memoizedProps.inspection===inspection)return true;if(f.child)stack.push(f.child);if(f.sibling)stack.push(f.sibling);}
 return false;
},inspection,{timeout:10000});}
try{
 if(process.env.REVIEW_ONLY!=='mobile'){
 const {page,context}=await makePage({width:1440,height:1000});
 await shot(page,'desktop-idle');
 await page.keyboard.down('Space');
 report.checks.push({name:'keyboard-held-state',result:await page.evaluate(()=>window.__reviewSim.held)});
 await seek(page,false,80);
 console.log('desktop power '+await page.locator('.power-heading strong').innerText());
 await shot(page,'desktop-powered');
 report.checks.push({name:'keyboard-power',power:await page.locator('.power-heading strong').innerText(),result:'Real Space key sets held state; production simulation advanced for a repeatable powered still'});
 await page.keyboard.up('Space');
 await page.getByRole('button',{name:'Inspect motor',exact:true}).click();
 await page.getByRole('button',{name:'Reassemble',exact:true}).waitFor();
 await committed(page,true);
 await seek(page,true);
 await shot(page,'desktop-exploded');
 await page.getByRole('button',{name:/Output shaft/}).click();
 await page.waitForTimeout(300);
 await shot(page,'desktop-shaft-selected');
 await page.getByRole('button',{name:'Reassemble',exact:true}).click();
 await committed(page,false);
 await seek(page,false);
 report.checks.push({name:'reassemble',result:await page.getByRole('button',{name:'Inspect motor',exact:true}).isVisible()});
 await context.close();
 }
 if(process.env.REVIEW_ONLY!=='desktop'){
 const mobile=await makePage({width:390,height:844},true);
 await shot(mobile.page,'mobile-idle');
 const hold=await mobile.page.getByRole('button',{name:'Hold to turn',exact:true}).boundingBox();
 const touch=await mobile.context.newCDPSession(mobile.page);
 await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:hold.x+hold.width/2,y:hold.y+hold.height/2}]});
 report.checks.push({name:'touch-held-state',result:await mobile.page.evaluate(()=>window.__reviewSim.held)});
 await seek(mobile.page,false,80);
 console.log('mobile power '+await mobile.page.locator('.power-heading strong').innerText());
 await shot(mobile.page,'mobile-powered');
 await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 report.checks.push({name:'touch-hold',power:await mobile.page.locator('.power-heading strong').innerText(),result:'Real touch sets held state; production simulation advanced for a repeatable powered still'});
 await mobile.page.getByRole('button',{name:'Inspect motor',exact:true}).tap();
 await mobile.page.getByRole('button',{name:'Reassemble',exact:true}).waitFor();
 await committed(mobile.page,true);
 await seek(mobile.page,true);
 await shot(mobile.page,'mobile-exploded');
 await mobile.context.close();
 }
}finally{
 await fs.writeFile(path.join(out,process.env.REVIEW_ONLY==='mobile'?'mobile-checks.json':'checks.json'),JSON.stringify(report,null,2));
 await browser.close();
}
console.log(JSON.stringify(report,null,2));
