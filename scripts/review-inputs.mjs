// Genuine input checks against the normal renderer; no seeking or sim mutation.
import { createRequire } from 'node:module';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(process.env.REVIEW_BROWSER_PACKAGE||'/workspace/workshop-browser/package.json');
const {chromium}=require('playwright-core');
const module=require('@sparticuz/chromium'),packagedChromium=module.default||module;
const run=promisify(execFile),origin=process.env.REVIEW_ORIGIN||'http://127.0.0.1:5173';
const out=process.env.REVIEW_OUT||'work/input-checks';await mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:await packagedChromium.executablePath(),headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage','--font-render-hinting=none','--single-process','--in-process-gpu','--no-zygote']});
const report={browser:await browser.version(),method:'Genuine desktop mouse/keyboard, normal demand rendering, reduced-motion context. R3F bridge reads source state/camera only; no seeking, manual render or simulation mutation.',checks:[],errors:[]};
const sim=()=>{
 const root=[...window.__reviewRoots.values()][0];const stack=[root.fiber.current];
 while(stack.length){const f=stack.pop();if(f?.memoizedProps?.sim?.current)return {...f.memoizedProps.sim.current};if(f?.child)stack.push(f.child);if(f?.sibling)stack.push(f.sibling);}
 throw Error('Simulation ref unavailable');
};
async function check(name,fn){try{const result=await fn();report.checks.push({name,passed:true,result});}catch(e){report.checks.push({name,passed:false,error:e.message});}console.log(JSON.stringify(report.checks.at(-1)));await writeFile(out+'/checks.json',JSON.stringify(report,null,2));}
try{
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 await context.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//,async route=>{const {stdout}=await run('curl',['--fail','--silent','--show-error','--location','--max-time','30',route.request().url()],{encoding:'buffer',maxBuffer:10*1024*1024});await route.fulfill({status:200,body:stdout,contentType:route.request().url().startsWith('https://fonts.googleapis.com/')?'text/css':'font/woff2'});});
 const page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));
 await page.goto(origin+'/scripts/review.html',{waitUntil:'networkidle',timeout:60000});
 await page.waitForFunction(()=>window.__reviewRoots?.size);
 await check('dynamic motion button switches preference both ways',async()=>{
  await page.getByRole('button',{name:'Less motion',exact:true}).click();assert(!await page.locator('.workshop').evaluate(e=>e.classList.contains('reduced')));
  await page.getByRole('button',{name:'Motion on',exact:true}).click();assert(await page.locator('.workshop').evaluate(e=>e.classList.contains('reduced')));return true;
 });
 await check('actual desktop handle mouse picking/drag/release',async()=>{
  await page.getByRole('button',{name:'Reset scene',exact:true}).click();
  const p=await page.evaluate(()=>{const r=[...window.__reviewRoots.values()][0].store.getState(),handle=r.scene.getObjectByName('crank-handle');const v=handle.position.clone().set(0,.62,.36);handle.localToWorld(v);v.project(r.camera);const b=r.gl.domElement.getBoundingClientRect();return{x:b.x+(v.x+1)*b.width/2,y:b.y+(1-v.y)*b.height/2};});
  const before=await page.evaluate(sim);await page.mouse.move(p.x,p.y);await page.mouse.down();assert((await page.evaluate(sim)).dragging);
  await page.mouse.move(p.x+24,p.y-14);const during=await page.evaluate(sim);assert.notEqual(during.crankAngle,before.crankAngle);await page.mouse.move(5,5);await page.mouse.up();assert(!(await page.evaluate(sim)).dragging);return{p,before,during};
 });
 await check('reduced inspection rendered endpoint and actual shaft mouse selection',async()=>{
  await page.getByRole('button',{name:'Inspect motor',exact:true}).click();
  await page.waitForFunction(()=>{const stack=[[...window.__reviewRoots.values()][0].fiber.current];while(stack.length){const f=stack.pop();if(f?.memoizedProps?.sim?.current?.explode===1)return true;if(f?.child)stack.push(f.child);if(f?.sibling)stack.push(f.sibling);}return false;},null,{timeout:30000});
  const p=await page.evaluate(()=>{const r=[...window.__reviewRoots.values()][0].store.getState(),shaft=r.scene.getObjectByName('shaft');const v=shaft.position.clone().set(0,0,.23);shaft.localToWorld(v);v.project(r.camera);const b=r.gl.domElement.getBoundingClientRect();return{x:b.x+(v.x+1)*b.width/2,y:b.y+(1-v.y)*b.height/2};});
  await page.mouse.click(p.x,p.y);assert.equal(await page.getByRole('button',{name:/Output shaft/}).getAttribute('aria-pressed'),'true');return p;
 });
 await check('rapid native UI transitions finish reassembled',async()=>{
  for(let i=0;i<5;i++)await page.locator('.inspect-button').click();assert.equal((await page.evaluate(sim)).inspect,false);assert.equal(await page.locator('.inspection-panel').count(),0);return true;
 });
 await check('About/Projects/CV panels and keyboard Escape',async()=>{
  for(const name of ['About','Projects','CV']){await page.getByRole('button',{name,exact:true}).click();assert.equal(await page.locator('dialog[open]').count(),1);await page.keyboard.press('Escape');assert.equal(await page.locator('dialog').count(),0);}return true;
 });
 await check('original CV and browser preview video available',async()=>{
  for(const asset of ['/documents/CV_DUZ.pdf','/projects/motor/motor-preview.webm']){const response=await context.request.get(origin+asset);assert.equal(response.status(),200);assert((await response.body()).length>1000);}return true;
 });
 assert.deepEqual(report.errors,[]);
}finally{await writeFile(out+'/checks.json',JSON.stringify(report,null,2));await browser.close();}
if(report.checks.some(x=>!x.passed)||report.errors.length)process.exitCode=1;
