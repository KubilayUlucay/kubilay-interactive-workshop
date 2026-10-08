import {chromium} from '/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core/index.mjs';
import fs from 'node:fs/promises';
const proxyURL=process.env.HTTP_PROXY||process.env.http_proxy;
let proxy;
if(proxyURL){const u=new URL(proxyURL);proxy={server:u.origin};if(u.username)proxy.username=decodeURIComponent(u.username);if(u.password)proxy.password=decodeURIComponent(u.password);}
const browser=await chromium.launch({executablePath:process.env.REVIEW_CHROMIUM_PATH,headless:true,proxy,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const response=await page.goto('https://kubilay-interactive-workshop.kubiulucay.chatgpt.site/',{waitUntil:'load',timeout:15000});
 const result={status:response.status(),url:page.url(),title:await page.title(),text:(await page.locator('body').innerText()).slice(0,700)};
 if(response.ok()){await page.waitForTimeout(2000);await page.screenshot({path:'/workspace/scratch/1677153ed499/portfolio-visual-review/live-desktop.png',timeout:15000});}
 console.log(JSON.stringify(result));
}catch(error){console.log(JSON.stringify({error:error.message.replace(/http:\/\/127\.0\.0\.1:\d+/g,'[configured proxy]')}));}
finally{await browser.close();}
