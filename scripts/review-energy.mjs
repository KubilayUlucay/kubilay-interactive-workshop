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
const report={browser:await browser.version(),method:'Genuine Space keyboard input and native CDP emulated touch, normal demand rendering. R3F bridge reads production state, heart/flow shader uniforms, and camera only. No simulation seeking/mutation or manual rendering. Software rendering does not establish real-device timing/FPS.',checks:[],errors:[],shaderErrors:[]};

const observe=()=>{
 const root=[...window.__reviewRoots.values()][0],r=root.store.getState(),stack=[root.fiber.current];let scene;
 while(stack.length){const f=stack.pop();if(f?.memoizedProps?.sim?.current&&typeof f.memoizedProps.onTelemetry==='function'){scene=f.memoizedProps;break;}if(f?.child)stack.push(f.child);if(f?.sibling)stack.push(f.sibling);}
 if(!scene)throw Error('Production Scene simulation ref unavailable');
 const visible=o=>{if(!o)return false;for(let node=o;node;node=node.parent)if(!node.visible)return false;return r.camera.layers.test(o.layers);};
 const effect=r.scene.getObjectByName('electrical-effects');
 const route=name=>{const mesh=r.scene.getObjectByName(name),u=mesh?.material.uniforms;return{present:!!mesh,shader:!!mesh?.material.isShaderMaterial,visible:visible(mesh),power:u?.uPower?.value,phase:u?.uPhase?.value,reduced:u?.uReduced?.value,length:u?.uLength?.value,offset:u?.uOffset?.value};};
 const heart=r.scene.getObjectByName('energy-heart'),board=r.scene.getObjectByName('heart-board'),leds=r.scene.getObjectByName('heart-leds'),glow=r.scene.getObjectByName('heart-glow'),light=r.scene.getObjectByName('heart-light'),u=leds?.material.uniforms;
 return {simulation:{...scene.sim.current},scene:{inspection:scene.inspection,reduced:scene.reduced,suspended:scene.suspended},effects:{present:!!effect,visible:effect?.visible,input:route('energy-trace'),output:route('energy-output-trace')},heart:{present:!!(heart&&board&&leds&&glow&&light),boardVisible:visible(board),ledsVisible:visible(leds),instanced:!!leds?.isInstancedMesh,instanceCount:leds?.count,indexCount:leds?.geometry.attributes.aLEDIndex?.count,shader:!!leds?.material.isShaderMaterial,power:u?.uPower?.value,phase:u?.uPhase?.value,reduced:u?.uReduced?.value,glowOpacity:glow?.material.opacity,glowVisible:visible(glow),lightIntensity:light?.intensity},root:{frameloop:r.frameloop,frames:r.internal.frames,active:r.internal.active,elapsed:r.clock.elapsedTime,xr:r.gl.xr.isPresenting,visibility:document.visibilityState,shaderProgramFailures:(r.gl.info.programs||[]).filter(p=>p.diagnostics?.runnable===false).map(p=>p.name)}};
};
const heartDark=s=>s.heart.present&&s.heart.power===0&&s.heart.glowOpacity===0&&s.heart.lightIntensity===0;
const flowsDark=s=>s.effects.input.power===0&&s.effects.output.power===0;
function assertShaderState(s){
 assert.deepEqual(s.root.shaderProgramFailures,[]);
 const expected=s.scene.inspection||s.scene.suspended?0:s.simulation.power;
 for(const flow of [s.effects.input,s.effects.output]){assert(flow.present&&flow.shader,'Both named flow routes must use ShaderMaterial');for(const key of ['power','phase','reduced','length','offset'])assert(Number.isFinite(flow[key]),'Flow uniform '+key+' must be finite');assert(flow.length>0);assert.equal(flow.power,expected);assert.equal(flow.phase,s.simulation.effectPhase);assert.equal(flow.reduced,Number(s.scene.reduced));}
 assert.equal(s.effects.input.offset,0);assert(Math.abs(s.effects.output.offset-s.effects.input.length)<1e-8,'Output phase distance must start at the input route end');
 assert(s.heart.present&&s.heart.instanced&&s.heart.shader,'Heart must use the named instanced LED shader');assert(s.heart.instanceCount>1);assert.equal(s.heart.indexCount,s.heart.instanceCount);assert(s.heart.boardVisible&&s.heart.ledsVisible,'Physical heart board and LEDs must remain visible');assert.equal(s.heart.power,expected);assert.equal(s.heart.phase,s.simulation.effectPhase);assert.equal(s.heart.reduced,Number(s.scene.reduced));
}
function assertHeartDark(s){assertShaderState(s);assert.equal(s.heart.power,0);assert.equal(s.heart.glowOpacity,0);assert.equal(s.heart.lightIntensity,0);}
function assertHeartPowered(s){assertShaderState(s);assert(s.heart.power>0);assert(s.heart.glowVisible);assert(s.heart.glowOpacity>0);assert(s.heart.lightIntensity>0);assert(s.effects.input.visible&&s.effects.output.visible);assert(s.effects.input.power>0&&s.effects.output.power>0);}
function assertHeartRamp(before,after){assertHeartPowered(after);assert(after.heart.power>before.heart.power);assert(after.heart.glowOpacity>before.heart.glowOpacity);assert(after.heart.lightIntensity>before.heart.lightIntensity);}
async function check(name,fn){try{report.checks.push({name,passed:true,result:await fn()});}catch(e){report.checks.push({name,passed:false,error:e.message});}console.log(JSON.stringify(report.checks.at(-1)));await writeFile(out+'/checks.json',JSON.stringify(report,null,2));}
async function until(page,predicate,label,timeout=90000){const deadline=Date.now()+timeout;let state,lastProgress=0;do{let timer;try{state=await Promise.race([page.evaluate(observe),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Renderer observation did not respond within 30s during '+label)),30000);timer.unref();})]);}finally{clearTimeout(timer);}if(predicate(state))return state;if(Date.now()-lastProgress>5000){lastProgress=Date.now();console.log(JSON.stringify({waiting:label,state}));await writeFile(out+'/last-observation.json',JSON.stringify({label,state},null,2));}await page.waitForTimeout(250);}while(Date.now()<deadline);throw Error(label+' did not reach expected state within '+timeout+'ms; last observation '+JSON.stringify(state));}
async function makePage({mobile=false,reduced=false}={}){
 if(!browser.isConnected())browser=await launch();
 const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:1000},deviceScaleFactor:1,isMobile:mobile,hasTouch:mobile,reducedMotion:reduced?'reduce':'no-preference'});
 await context.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//,async route=>{const {stdout}=await run('curl',['--fail','--silent','--show-error','--location','--max-time','30',route.request().url()],{encoding:'buffer',maxBuffer:10*1024*1024});await route.fulfill({status:200,body:stdout,contentType:route.request().url().startsWith('https://fonts.googleapis.com/')?'text/css':'font/woff2'});});
 const page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));page.on('console',message=>{if(message.type()==='error'&&/shader|WebGLProgram|VALIDATE_STATUS|linkProgram|compile/i.test(message.text()))report.shaderErrors.push(message.text());});page.setDefaultTimeout(30000);
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
  assertHeartDark(before);
  await page.keyboard.down('Space');
  const first=await until(page,s=>s.simulation.held&&s.simulation.power>.08&&s.effects.visible,'normal keyboard power');
  const after=await until(page,s=>s.simulation.power>first.simulation.power&&s.simulation.motorAngle!==first.simulation.motorAngle&&s.simulation.effectPhase!==first.simulation.effectPhase,'normal phase/motor movement');
  assertShaderState(after);
  assertHeartRamp(first,after);
  return{before,first,after};
 });
 await check('inspection cancels input, hides effects on its rendered frame, freezes motor and electrical phase',async()=>{
  await pressInspection(page,'Inspect motor');await page.keyboard.up('Space');
  const paused=await until(page,s=>s.simulation.inspect&&s.scene.inspection&&!s.effects.visible&&flowsDark(s)&&heartDark(s),'inspection effects and heart off');
  assert.equal(paused.simulation.held,false);assert.equal(paused.simulation.dragging,false);assert.equal(paused.effects.input.power,0);assert.equal(paused.effects.output.power,0);
  const later=await until(page,s=>s.scene.inspection&&s.root.elapsed>paused.root.elapsed,'another inspection render');
  assert.equal(later.simulation.motorAngle,paused.simulation.motorAngle);assert.equal(later.simulation.effectPhase,paused.simulation.effectPhase);assert.equal(later.effects.visible,false);
  assertHeartDark(paused);assertHeartDark(later);
  return{paused,later};
 });
 if(!pauseOnly)await check('normal UI reassembly reaches assembled endpoint and restores power input',async()=>{
  await pressInspection(page,'Reassemble');const state=await until(page,s=>!s.simulation.inspect&&!s.scene.inspection&&s.simulation.explode===0,'normal reassembly',120000);
  assert(await page.getByRole('button',{name:'Hold to turn',exact:true}).isEnabled());assertShaderState(state);return state;
 });
 await normal.context.close();await browser.close();
 }

 if(!only||only==='reduced'){
 const reduced=await makePage({reduced:true});
 await check('reduced motion retains static powered feedback without automatic motor/phase movement',async()=>{
  const p=reduced.page;await p.locator('body').click({position:{x:5,y:5}});const before=await p.evaluate(observe);await p.keyboard.down('Space');
  assertHeartDark(before);
  const first=await until(p,s=>s.scene.reduced&&s.simulation.held&&s.simulation.power>.08&&s.effects.visible,'reduced power');
  const after=await until(p,s=>s.simulation.power>first.simulation.power+.02,'reduced power continues rising');
  assert.equal(after.simulation.motorAngle,before.simulation.motorAngle);assert.equal(after.simulation.crankAngle,before.simulation.crankAngle);assert.equal(after.simulation.effectPhase,before.simulation.effectPhase);
  assert.equal(after.effects.input.phase,first.effects.input.phase);assert.equal(after.effects.output.phase,first.effects.output.phase);assert.equal(after.heart.phase,first.heart.phase);assertShaderState(after);
  assertHeartRamp(first,after);
  await p.keyboard.up('Space');return{before,first,after};
 });
 await check('actual release coast dims the heart; native reset restores heart and cable idle baselines',async()=>{
  const p=reduced.page;await p.locator('body').click({position:{x:5,y:5}});await p.keyboard.down('Space');
  const charged=await until(p,s=>s.simulation.held&&s.simulation.power>.30&&s.heart.power>0&&s.heart.lightIntensity>0,'heart charged before release');
  await p.keyboard.up('Space');
  const coast=await until(p,s=>!s.simulation.held&&s.simulation.power<charged.simulation.power*.60,'actual power coast',120000);
  assert(coast.heart.power<charged.heart.power);assert(coast.heart.glowOpacity<charged.heart.glowOpacity);assert(coast.heart.lightIntensity<charged.heart.lightIntensity);assert(coast.effects.input.power<charged.effects.input.power);assert(coast.effects.output.power<charged.effects.output.power);assertShaderState(coast);
  await p.getByRole('button',{name:'Reset scene',exact:true}).click({force:true});await selectVisibleScene(p);
  const reset=await until(p,s=>s.simulation.power===0&&!s.simulation.held&&!s.simulation.dragging&&!s.effects.visible&&flowsDark(s)&&heartDark(s),'native reset idle heart and cable');
  assertHeartDark(reset);assert.equal(reset.effects.input.power,0);assert.equal(reset.effects.output.power,0);assert.equal(reset.simulation.effectPhase,0);return{charged,coast,reset};
 });
 await check('dialog suspension cancels held input, hides effects, freezes simulation; Escape restores the scene',async()=>{
  const p=reduced.page;await p.locator('body').click({position:{x:5,y:5}});await p.keyboard.down('Space');
  await until(p,s=>s.simulation.held&&s.simulation.power>.08&&s.effects.visible,'power before dialog');
  await p.getByRole('button',{name:'About',exact:true}).click({force:true});await p.keyboard.up('Space');
  const paused=await until(p,s=>s.scene.suspended&&!s.effects.visible&&!s.simulation.held&&flowsDark(s)&&heartDark(s),'dialog suspension and heart off');await p.waitForTimeout(500);const later=await p.evaluate(observe);
  assert.equal(later.simulation.power,paused.simulation.power);assert.equal(later.simulation.effectPhase,paused.simulation.effectPhase);assert.equal(later.simulation.motorAngle,paused.simulation.motorAngle);
  assertHeartDark(paused);assertHeartDark(later);
  await p.keyboard.press('Escape');assert.equal(await p.locator('dialog').count(),0);const restored=await until(p,s=>!s.scene.suspended&&s.effects.visible&&s.heart.lightIntensity>0,'dialog rendered resume');assertHeartPowered(restored);return{paused,later,restored};
 });
 await reduced.context.close();await browser.close();
 }

 if(!only||only==='mobile'){
 const mobile=await makePage({mobile:true,reduced:true}),touch=await mobile.context.newCDPSession(mobile.page);
 await check('native mobile touch picks the actual crank, energizes feedback, and cancels capture',async()=>{
  const p=mobile.page;const target=await p.evaluate(()=>{const r=[...window.__reviewRoots.values()][0].store.getState(),h=r.scene.getObjectByName('crank-handle');const v=h.position.clone().set(0,.62,.36);h.localToWorld(v);v.project(r.camera);const b=r.gl.domElement.getBoundingClientRect();return{x:b.x+(v.x+1)*b.width/2,y:b.y+(1-v.y)*b.height/2};});
  const before=await p.evaluate(observe);assertHeartDark(before);await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[target]});assert((await p.evaluate(observe)).simulation.dragging);
  for(let i=1;i<=4;i++)await touch.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:target.x+i*10,y:target.y-i*6}]});
  const after=await until(p,s=>s.simulation.dragging&&s.simulation.power>0&&s.effects.visible,'direct touch power');assert.notEqual(after.simulation.crankAngle,before.simulation.crankAngle);assert(after.effects.input.power>0&&after.effects.output.power>0);
  assertHeartRamp(before,after);
  await touch.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});assert.equal((await p.evaluate(observe)).simulation.dragging,false);return{target,before,after};
 });
 await check('native mobile touch inspection, all four part buttons, and reassembly remain available',async()=>{
  const p=mobile.page;await p.getByRole('button',{name:'Inspect motor',exact:true}).tap();await selectVisibleScene(p);
  const inspection=await until(p,s=>s.scene.inspection&&s.simulation.explode===1&&!s.effects.visible&&flowsDark(s)&&heartDark(s),'mobile inspection and heart off');assertHeartDark(inspection);
  const selected=[];
  for(const name of ['Copper windings','Magnet rotors','Bearing supports','Output shaft']){const b=p.getByRole('button',{name:new RegExp(name)});await b.tap();assert.equal(await b.getAttribute('aria-pressed'),'true');selected.push(name);}
  await p.getByRole('button',{name:'Reassemble',exact:true}).tap();await selectVisibleScene(p);const after=await until(p,s=>!s.scene.inspection&&s.simulation.explode===0,'mobile reassembly');
  assert.equal(await p.locator('.inspection-panel').count(),0);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assertShaderState(after);return{selected,after};
 });
 await mobile.context.close();await browser.close();
 }
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.shaderErrors,[]);
}finally{await writeFile(out+'/checks.json',JSON.stringify(report,null,2));await browser.close();}
if(report.checks.some(c=>!c.passed)||report.errors.length||report.shaderErrors.length)process.exitCode=1;
