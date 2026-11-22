import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const p = await (await b.newContext({ viewport:{width:1440,height:1000} })).newPage();
await p.goto('http://127.0.0.1:5173/products/small-easy-zipper-tote',{waitUntil:'networkidle'});
await p.waitForTimeout(1200);
console.log(await p.evaluate(() => {
  const rail = document.querySelectorAll('.rail__scroll > *');
  const first = rail[0]?.outerHTML.slice(0,600);
  const empties = [...document.querySelectorAll('.rail__scroll img')].map(i=>({src:i.currentSrc||i.src, w:i.naturalWidth}));
  const blocks = [...document.querySelectorAll('main > * , .pdp > *')].map(e=>({cls:e.className, h:e.getBoundingClientRect().height}));
  return { count: rail.length, first, empties: empties.slice(0,4), blocks };
}));
await b.close();
