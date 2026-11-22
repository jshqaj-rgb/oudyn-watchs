import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const p = await (await b.newContext({ viewport:{width:1440,height:1000} })).newPage();
async function shot(name, url) {
  await p.goto('http://127.0.0.1:5173'+url, { waitUntil:'networkidle' });
  await p.evaluate(async () => { for (let y=0;y<document.body.scrollHeight;y+=600){window.scrollTo(0,y); await new Promise(r=>setTimeout(r,60));} window.scrollTo(0,0); });
  await p.waitForTimeout(700);
  await p.screenshot({ path:`/Users/lee/PHP_WORK/bags/.ref/f-${name}.png`, fullPage:true });
}
await shot('pdp','/products/small-easy-zipper-tote');
await shot('faq','/pages/faq');
await shot('about','/pages/about');
await shot('build','/pages/build-your-system');
await b.close();
