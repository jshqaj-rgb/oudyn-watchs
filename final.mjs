import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const errs=[];
const p = await (await b.newContext({ viewport:{width:1440,height:1000} })).newPage();
p.on('pageerror', e=>errs.push(e.message.slice(0,120)));
p.on('console', m=>{ if(m.type()==='error') errs.push('C:'+m.text().slice(0,120)); });
for (const [n,u] of [['about','/pages/about'],['wishlist','/wishlist'],['account','/account'],['search','/search?q=zipper']]) {
  await p.goto('http://127.0.0.1:5173'+u, { waitUntil:'networkidle' });
  await p.waitForTimeout(700);
  await p.screenshot({ path:`/Users/lee/PHP_WORK/bags/.ref/z-${n}.png` });
}
console.log('errs', [...new Set(errs)]);
await b.close();
