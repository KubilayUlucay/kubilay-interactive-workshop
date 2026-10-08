import { chromium as playwright } from '/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core/index.mjs';
import chromium from '@sparticuz/chromium';
import fs from 'node:fs/promises';

const out = '/workspace/scratch/1677153ed499/portfolio-visual-review';
await fs.mkdir(out, {recursive:true});
const browser = await playwright.launch({args:chromium.args, executablePath:process.env.REVIEW_CHROMIUM_PATH || await chromium.executablePath(), headless:true});
const page = await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
const errors=[];
page.on('pageerror',error=>errors.push(error.message));
const result={browser:await browser.version(),attempts:[],errors};
try {
  for(const url of ['https://kubilay-interactive-workshop.kubiulucay.chatgpt.site/','http://terminal.local:4173/']) {
    try {
      const response=await page.goto(url,{waitUntil:'load',timeout:30000});
      await page.waitForTimeout(2000);
      result.attempts.push({url,status:response?.status(),title:await page.title(),text:(await page.locator('body').innerText()).slice(0,1000)});
      if(await page.getByRole('button',{name:'Hold to turn',exact:true}).count()) {result.activeURL=page.url();break;}
    }catch(error){result.attempts.push({url,error:error.message});}
  }
  result.graphics=await page.evaluate(()=>{
    const c=document.createElement('canvas'),gl=c.getContext('webgl2');
    if(!gl)return {webgl2:false};
    const ext=gl.getExtension('WEBGL_debug_renderer_info');
    const r={webgl2:true,vendor:ext?gl.getParameter(ext.UNMASKED_VENDOR_WEBGL):gl.getParameter(gl.VENDOR),renderer:ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER)};
    gl.getExtension('WEBGL_lose_context')?.loseContext();return r;
  });
  await page.screenshot({path:out+'/probe-desktop.png',fullPage:true});
  await fs.writeFile(out+'/probe.json',JSON.stringify(result,null,2));
  console.log(JSON.stringify(result,null,2));
}finally{await browser.close();}
