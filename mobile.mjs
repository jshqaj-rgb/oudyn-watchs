import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const c = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const p = await c.newPage();
for (const [n, u] of [['home','/'],['plp','/collections/all'],['pdp','/products/small-easy-zipper-tote'],['cart','/cart']]) {
  await p.goto('http://127.0.0.1:5173'+u, { waitUntil: 'networkidle' });
  await p.waitForTimeout(700);
  await p.screenshot({ path: `/Users/lee/PHP_WORK/bags/.ref/m-${n}.png` });
}
console.log('hdr h', await p.locator('.header').boundingBox());
await b.close();
