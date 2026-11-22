import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const c = await b.newContext({ viewport: { width: 1440, height: 1000 } });
const p = await c.newPage();
const errs=[];
p.on('pageerror', e=>errs.push(e.message.slice(0,120)));
for (const [n,u,full] of [
  ['pdp-full','/products/small-easy-zipper-tote',true],
  ['faq','/pages/faq',true],
  ['about','/pages/about',true],
  ['build','/pages/build-your-system',false],
  ['wishlist','/wishlist',false],
  ['404','/nope',false],
  ['search','/search?q=tote',false],
]) {
  await p.goto('http://127.0.0.1:5173'+u, { waitUntil:'networkidle' });
  await p.waitForTimeout(800);
  await p.screenshot({ path:`/Users/lee/PHP_WORK/bags/.ref/p2-${n}.png`, fullPage: full });
}
console.log('errs', errs);
await b.close();
