import { chromium } from 'playwright';
import { readdirSync } from 'fs';
const dir='/Users/lee/Downloads/cuyana';
const map={ "Cuyana _ Women's Premium Essentials.html":'home', "Bags – Cuyana.html":'bags', "Small Easy Zipper Tote – Cuyana.html":'product', "Visit Us – Cuyana.html":'visit'};
const b = await chromium.launch({executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const ctx = await b.newContext({viewport:{width:1440,height:900}});
for (const f of Object.keys(map)){
  const name=map[f];
  const p = await ctx.newPage();
  await p.goto('file://'+dir+'/'+f, {waitUntil:'load', timeout:60000}).catch(e=>console.log(name,e.message));
  await p.waitForTimeout(3000);
  await p.screenshot({path:`/Users/lee/PHP_WORK/bags/.ref/${name}-full.png`, fullPage:true}).catch(e=>console.log('shot',name,e.message));
  await p.screenshot({path:`/Users/lee/PHP_WORK/bags/.ref/${name}-top.png`}).catch(()=>{});
  await p.close();
}
await b.close();
