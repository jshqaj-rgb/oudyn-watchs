import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });
page.on('pageerror', (e) => errors.push('PAGEERROR ' + e.message.slice(0, 200)));
const targets = [
  ['home', '/'],
  ['collections', '/collections/all'],
  ['product', '/products/small-easy-zipper-tote'],
  ['stores', '/pages/stores'],
  ['faq', '/pages/faq'],
];
for (const [name, path] of targets) {
  await page.goto('http://127.0.0.1:5173' + path, { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
  await page.screenshot({ path: `/Users/lee/PHP_WORK/bags/.ref/build-${name}.png`, fullPage: false });
}
console.log('ERRORS', JSON.stringify([...new Set(errors)].slice(0, 12), null, 1));
await browser.close();
