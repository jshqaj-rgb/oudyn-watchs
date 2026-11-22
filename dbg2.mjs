import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const p = await (await b.newContext({ viewport:{width:1440,height:1000} })).newPage();
await p.goto('http://127.0.0.1:5173/products/small-easy-zipper-tote',{waitUntil:'networkidle'});
await p.waitForTimeout(1000);
console.log(await p.evaluate(() => {
  const el = document.elementFromPoint(500, 660);
  const chain = [];
  let n = el;
  while (n && chain.length < 6) { chain.push(`${n.tagName}.${n.className} ${Math.round(n.getBoundingClientRect().height)}px`); n = n.parentElement; }
  const railImgs = [...document.querySelectorAll('.rail__scroll img')].slice(0,3).map(i=>({src:i.getAttribute('src'), complete:i.complete, w:i.naturalWidth}));
  return { chain, railImgs };
}));
await b.close();
