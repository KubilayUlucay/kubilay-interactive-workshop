// Genuine input and read-only R3F observations. No seeking, manual render, or sim mutation.
import { createRequire } from 'node:module';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const require=createRequire(process.env.REVIEW_BROWSER_PACKAGE||'/workspace/workshop-browser/package.json');
const {chromium}=require('playwright-core');
const module=require('@sparticuz/chromium'),packagedChromium=module.default||module;
const run=promisify(execFile),origin=process.env.REVIEW_ORIGIN||'http://127.0.0.1:5173';
const out=process.env.REVIEW_OUT||'work/energy-input-checks';
const only=process.env.REVIEW_ONLY;
const pauseOnly=process.env.REVIEW_CHECK==='pause';
await mkdir(out,{recursive:true});
const launch=async()=>chromium.launch({executablePath:await packagedChromium.executablePath(),headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage','--font-render-hinting=none','--single-process','--in-process-gpu','--no-zygote']});
let browser=await launch();
const report={browser:await browser.version(),method:'Genuine Space keyboard input and native CDP emulated touch, normal demand rendering. R3F bridge reads production state, effects, and camera only. No simulation seeking/mutation or manual rendering. Software rendering does not establish real-device timing/FPS.',checks:[],errors:[]};

const observe=()=>{
 const root=[...window.__reviewRoots.values()][0],r=root.store.getState(),stack=[root.fiber.current];let scene;
 while(stack.length){const f=stack.pop();if(f?.memoizedProps?.sim?.current&&typeof f.memoizedProps.onTelemetry==='function'){scene=f.memoizedProps;break;}if(f?.child)stack.push(f.child);if(f?.sibling)stack.push(f.sibling);}
 if(!scene)throw Error('Production Scene simulation ref unavailable');
 const effect=r.scene.getObjectByName('electrical-effects'),trace=r.scene.getObjectByName('energy-trace'),bead=r.scene.getObjectByName('energy-bead-0'),arc=r.scene.getObjectByName('energy-arc-0');
 const glass=r.scene.getObjectByName('lamp-glass'),filament=r.scene.getObjectByName('lamp-filament'),glow=r.scene.getObjectByName('lamp-glow'),lampLight=r.scene.getObjectByName('lamp-light');
 const visible=o=>{if(!o)return false;for(let node=o;node;node=node.parent)if(!node.visible)return false;return r.camera.layers.test(o.layers);};
 return {simulation:{...scene.sim.current},scene:{inspection:scene.inspection,reduced:scene.reduced,suspended:scene.suspended},effects:{present:!!effect,visible:effect?.visible,traceOpacity:trace?.material.opacity,beadOpacity:bead?.material.opacity,arcOpacity:arc?.material.opacity,beadPosition:bead?.position.toArray(),arcRotation:arc?.rotation.z,cameraLayerMatches:!!(effect&&r.camera.layers.test(effect.layers))},lamp:{present:!!(glass&&filament&&glow&&lampLight),glassVisible:visible(glass),glassOpacity:glass?.material.opacity,filamentEmission:filament?.material.emissiveIntensity,glowOpacity:glow?.material.opacity,glowVisible:visible(glow),lightIntensity:lampLight?.intensity},root:{frameloop:r.frameloop,frames:r.internal.frames,active:r.internal.active,elapsed:r.clock.elapsedTime,xr:r.gl.xr.isPresenting,visibility:document.visibilityState}};
};
const lampDark=s=>s.lamp.present&&s.lamp.filamentEmission===0&&s.lamp.glowOpacity===0&&s.lamp.lightIntensity===0;
function assertLampDark(s){assert(s.lamp.present,'Named lamp meshes and local light must exist');assert(s.lamp.glassVisible,'Physical glass must remain visible when unpowered');assert.equal(s.lamp.filamentEmission,0);assert.equal(s.lamp.glowOpacity,0);assert.equal(s.lamp.lightIntensity,0);}
function assertLampPowered(s){assert(s.lamp.present,'Named lamp meshes and local light must exist');assert(s.lamp.glassVisible,'Physical glass must remain visible when powered');assert(s.lamp.glowVisible);assert(s.lamp.filamentEmission>0);assert(s.lamp.glowOpacity>0);assert(s.lamp.lightIntensity>0);}
function assertLampRamp(before,after){assertLampPowered(after);assert(after.lamp.filamentEmission>before.lamp.filamentEmission);assert(after.lamp.glowOpacity>before.lamp.glowOpacity);assert(after.lamp.lightIntensity>before.lamp.lightIntensity);}
async function check(name,fn){try{report.checks.push({name,passed:true,result:await fn()});}catch(e){report.checks.push({name,passed:false,error:e.message});}console.log(JSON.stringify(report.checks.at(-1)));await writeFile(out+'/checks.json',JSON.stringify(report,null,2));}
async function until(page,predicate,label,timeout=90000){const deadline=Date.now()+timeout;let state,lastProgress=0;do{let timer;try{state=await Promise.race([page.evaluate(observe),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Renderer observation did not respond within 30s during '+label)),30000);timer.unref();})]);}finally{clearTimeout(timer);}if(predicate(state))return state;if(Date.now()-lastProgress>5000){lastProgress=Date.now();console.log(JSON.stringify({waiting:label,state}));await writeFile(out+'/last-observation.json',JSON.stringify({label,state},null,2));}await page.waitForTimeout(250);}while(Date.now()<deadline);throw Error(label+' did not reach expected state within '+timeout+'ms; last observation '+JSON.stringify(state));}
async function makePage({mobile=false,reduced=false}={}){
 if(!browser.isConnected())browser=await launch();
 const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:1000},deviceScaleFactor:1,isMobile:mobile,hasTouch:mobile,reducedMotion:reduced?'reduce':'no-preference'});
 await context.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//,async route=>{const {stdout}=await run('curl',['--fail','--silent','--show-error','--location','--max-time','30',route.request().url()],{encoding:'buffer',maxBuffer:10*1024*1024});await route.fulfill({status:200,body:stdout,contentType:route.request().url().startsWith('https://fonts.googleapis.com/')?'text/css':'font/woff2'});});
 const page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));page.setDefaultTimeout(30000);
 await page.goto(origin+'/scripts/review.html',{waitUntil:'networkidle',timeout:60000});
 await page.waitForFunction(()=>window.__reviewRoots?.size&&document.querySelector('canvas')?.width);
 await page.evaluate(()=>scrollTo(0,0));return{context,page};
}
async function selectVisibleScene(page){await page.evaluate(()=>scrollTo(0,0));}
async function pressInspection(page,name){await page.getByRole('button',{name,exact:true}).click({force:true});await selectVisibleScene(page);}

try{
 if(!only||only==='normal'){
 const normal=await makePage();const page=normal.page;
 await check('normal keyboard Space advances motor and electrical phase with visible power feedback',async()=>{
  await page.locator('body').click({position:{x:5,y:5}});const before=await page.evaluate(observe);
  assertLampDark(before);
  await page.keyboard.down('Space');
  const first=await until(page,s=>s.simulation.held&&s.simulation.power>.08&&s.effects.visible,'normal keyboard power');
  const after=await until(page,s=>s.simulation.power>first.simulation.power&&s.simulation.motorAngle!==first.simulation.motorAngle&&s.simulation.effectPhase!==first.simulation.effectPhase,'normal phase/motor movement');
  assert(after.effects.traceOpacity>0&&after.effects.beadOpacity>0&&after.effects.arcOpacity>0);assert(after.effects.cameraLayerMatches);
  assertLampRamp(first,after);
  return{before,first,after};
 });
 await check('inspection cancels input, hides effects on its rendered frame, freezes motor and electrical phase',async()=>{
  await pressInspection(page,'Inspect motor');await page.keyboard.up('Space');
  const paused=await until(page,s=>s.simulation.inspect&&s.scene.inspection&&!s.effects.visible&&lampDark(s),'inspection effects and lamp off');
  assert.equal(paused.simulation.held,false);assert.equal(paused.simulation.dragging,false);assert.equal(paused.effects.traceOpacity,0);
  const later=await until(page,s=>s.scene.inspection&&s.root.elapsed>paused.root.elapsed,'another inspection render');
  assert.equal(later.simulation.motorAngle,paused.simulation.motorAngle);assert.equal(later.simulation.effectPhase,paused.simulation.effectPhase);assert.equal(later.effects.visible,false);
  assertLampDark(paused);assertLampDark(later);
  return{paused,later};
 });
 if(!pauseOnly)await check('normal UI reassembly reaches assembled endpoint and restores power input',async()=>{
  await pressInspection(page,'Reassemble');const state=await until(page,s=>!s.simulation.inspect&&!s.scene.inspection&&s.simulation.explode===0,'normal reassembly',120000);
  assert(await page.getByRole('button',{name:'Hold to turn',exact:true}).isEnabled());return state;
 });
 await normal.context.close();await browser.close();
 }

 if(!only||only==='reduced'){
 const reduced=await makePage({reduced:true});
 await check('reduced motion retains static powered feedback without automatic motor/phase movement',async()=>{
  const p=reduced.page;await p.locator('body').click({position:{x:5,y:5}});const before=await p.evaluate(observe);await p.keyboard.down('Space');
  assertLampDark(before);
  const first=await until(p,s=>s.scene.reduced&&s.simulation.held&&s.simulation.power>.08&&s.effects.visible,'reduced power');
  const after=await until(p,s=>s.simulation.power>first.simulation.power+.02,'reduced power continues rising');
  assert.equal(after.simulation.motorAngle,before.simulation.motorAngle);assert.equal(after.simulation.crankAngle,before.simulation.crankAngle);assert.equal(after.simulation.effectPhase,before.simulation.effectPhase);
  assert.deepEqual(after.effects.beadPosition,first.effects.beadPosition);assert.equal(after.effects.arcRotation,first.effects.arcRotation);assert(after.effects.traceOpacity>0&&after.effects.beadOpacity>0&&after.effects.arcOpacity>0);assert(after.effects.cameraLayerMatches);
  assertLampRamp(first,after);
  await p.keyboard.up('Space');return{before,first,after};
 });
 await check('actual release coast dims the lamp; native reset restores lamp and cable idle baselines',async()=>{
  const p=reduced.page;await p.locator('body').click({position:{x:5,y:5}});await p.keyboard.down('Space');
  const charged=await until(p,s=>s.simulation.held&&s.simulation.power>.30&&s.lamp.filamentEmission>0&&s.lamp.lightIntensity>0,'lamp charged before release');
  await p.keyboard.up('Space');
  const coast=await until(p,s=>!s.simulation.held&&s.simulation.power<charged.simulation.power*.60,'actual power coast',120000);
  assert(coast.lamp.filamentEmission<charged.lamp.filamentEmission);assert(coast.lamp.glowOpacity<charged.lamp.glowOpacity);assert(coast.lamp.lightIntensity<charged.lamp.lightIntensity);assert(coast.effects.traceOpacity<charged.effects.traceOpacity);assert(coast.lamp.glassVisible);
  await p.getByRole('button',{name:'Reset scene',exact:true}).click({force:true});await selectVisibleScene(p);
  const reset=await until(p,s=>s.simulation.power===0&&!s.simulation.held&&!s.simulation.dragging&&!s.effects.visible&&lampDark(s),'native reset idle lamp and cable');
  assertLampDark(reset);assert.equal(reset.effects.traceOpacity,0);assert.equal(reset.effects.beadOpacity,0);assert.equal(reset.effects.arcOpacity,0);assert.equal(reset.simulation.effectPhase,0);return{charged,coast,reset};
 });
 await check('dialog suspension cancels held input, hides effects, freezes simulation; Escape restores the scene',async()=>{
  const p=reduced.page;await p.locator('body').click({position:{x:5,y:5}});await p.keyboard.down('Space');
  await until(p,s=>s.simulation.held&&s.simulation.power>.08&&s.effects.visible,'power before dialog');
  await p.getByRole('button',{name:'About',exact:true}).click({force:true});await p.keyboard.up('Space');
  const paused=await until(p,s=>s.scene.suspended&&!s.effects.visible&&!s.simulation.held&&lampDark(s),'dialog suspension and lamp off');await p.waitForTimeout(500);const later=await p.evaluate(observe);
  assert.equal(later.simulation.power,paused.simulation.power);assert.equal(later.simulation.effectPhase,paused.simulation.effectPhase);assert.equal(later.simulation.motorAngle,paused.simulation.motorAngle);
  assertLampDark(paused);assertLampDark(later);
  await p.keyboard.press('Escape');assert.equal(await p.locator('dialog').count(),0);const restored=await until(p,s=>!s.scene.suspended&&s.effects.visible&&s.lamp.lightIntensity>0,'dialog rendered resume');assertLampPowered(restored);return{paused,later,restored};
 });
 await reduced.context.close();await browser.close();
 }

 if(!only||only==='mobile'){
 const mobile=await makePage({mobile:true,reduced:true}),touch=await mobile.context.newCDPSession(mobile.page);
 await check('native mobile touch picks the actual crank, energizes feedback, and cancels capture',async()=>{
  const p=mobile.page;const target=await p.evaluate(()=>{const r=[...window.__reviewRoots.values()][0].store.getState(),h=r.scene.getObjectByName('crank-handle');const v=h.position.clone().set(0,.62,.36);h.localToWorld(v);v.project(r.camera);const b=r.gl.domElement.getBoundingClientRect();return{x:b.x+(v.x+1)*b.width/2,y:b.y+(1-v.y)*b.height/2};});
  const before=await p.evaluate(observe);assertLampDark(before);await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[target]});assert((await p.evaluate(observe)).simulation.dragging);
  for(let i=1;i<=4;i++)await touch.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:target.x+i*10,y:target.y-i*6}]});
  const after=await until(p,s=>s.simulation.dragging&&s.simulation.power>0&&s.effects.visible,'direct touch power');assert.notEqual(after.simulation.crankAngle,before.simulation.crankAngle);assert(after.effects.traceOpacity>0);
  assertLampRamp(before,after);
  await touch.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});assert.equal((await p.evaluate(observe)).simulation.dragging,false);return{target,before,after};
 });
 await check('native mobile touch inspection, all four part buttons, and reassembly remain available',async()=>{
  const p=mobile.page;await p.getByRole('button',{name:'Inspect motor',exact:true}).tap();await selectVisibleScene(p);
  const inspection=await until(p,s=>s.scene.inspection&&s.simulation.explode===1&&!s.effects.visible&&lampDark(s),'mobile inspection and lamp off');assertLampDark(inspection);
  const selected=[];
  for(const name of ['Copper windings','Magnet rotors','Bearing supports','Output shaft']){const b=p.getByRole('button',{name:new RegExp(name)});await b.tap();assert.equal(await b.getAttribute('aria-pressed'),'true');selected.push(name);}
  await p.getByRole('button',{name:'Reassemble',exact:true}).tap();await selectVisibleScene(p);const after=await until(p,s=>!s.scene.inspection&&s.simulation.explode===0,'mobile reassembly');
  assert.equal(await p.locator('.inspection-panel').count(),0);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);return{selected,after};
 });
 await mobile.context.close();await browser.close();
 }
 assert.deepEqual(report.errors,[]);
}finally{await writeFile(out+'/checks.json',JSON.stringify(report,null,2));await browser.close();}
if(report.checks.some(c=>!c.passed)||report.errors.length)process.exitCode=1;
