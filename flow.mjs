import { chromium } from 'playwright';
const B = 'http://127.0.0.1:5173';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', e => errs.push(e.message.slice(0,160)));
p.on('console', m => { if (m.type()==='error') errs.push('C:'+m.text().slice(0,160)); });
const shot = n => p.screenshot({ path: `/Users/lee/PHP_WORK/bags/.ref/flow-${n}.png` });

await p.goto(B + '/', { waitUntil: 'networkidle' });
await p.hover('.nav__item:nth-child(1)');
await p.waitForTimeout(400);
console.log('mega visible:', await p.isVisible('.mega'));
await shot('mega');
await p.mouse.move(720, 700);
await p.waitForTimeout(300);

// PDP -> add to bag
await p.goto(B + '/products/tall-easy-zipper-tote', { waitUntil: 'networkidle' });
await p.waitForTimeout(500);
await p.click('.color-opt:nth-child(3)');
const colorName = await p.textContent('.pdp__color-name').catch(()=>null);
await p.click('.pdp__buy button.btn--dark');
await p.waitForTimeout(700);
console.log('drawer open:', await p.isVisible('.drawer'), 'color:', colorName);
await shot('drawer');

// cart + promo
await p.goto(B + '/cart', { waitUntil: 'networkidle' });
await p.waitForTimeout(500);
console.log('cart lines:', await p.locator('.cart-line').count());
await p.fill('.promo-row input', 'FEWER15');
await p.click('.promo-row button');
await p.waitForTimeout(600);
console.log('has discount:', await p.locator('text=Discount').count() > 0);
await shot('cart');

// checkout
await p.goto(B + '/checkout', { waitUntil: 'networkidle' });
await p.waitForTimeout(500);
await p.fill('input[type=email]', 'lee@example.com');
const inputs = p.locator('.checkout__main .input');
const vals = ['lee@example.com','Lee','Chen','123 Valencia St','','San Francisco','CA','94103','4155551234','4242424242424242','12/28','123'];
for (let i=0;i<vals.length;i++) await inputs.nth(i).fill(vals[i]);
await p.waitForTimeout(200);
await p.click('.checkout__main button[type=submit]');
await p.waitForTimeout(1200);
console.log('url after checkout:', p.url());
await shot('confirm');

// account
await p.goto(B + '/account/login', { waitUntil: 'networkidle' });
await p.fill('input[autocomplete=email]', 'lee@example.com');
await p.fill('input[autocomplete=current-password]', 'secret123');
await p.click('form button[type=submit]');
await p.waitForTimeout(900);
console.log('account url:', p.url());
await p.reload({ waitUntil: 'networkidle' });
await p.waitForTimeout(800);
console.log('orders rows:', await p.locator('.order-row').count());
await shot('account');

// search + 404
await p.goto(B + '/search?q=tote', { waitUntil: 'networkidle' });
await p.waitForTimeout(700);
console.log('search cards:', await p.locator('.pcard').count());
await shot('search');
await p.goto(B + '/nope/nope', { waitUntil: 'networkidle' });
await shot('404');

// mobile
const m = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
await m.goto(B + '/', { waitUntil: 'networkidle' });
await m.waitForTimeout(600);
await m.screenshot({ path: '/Users/lee/PHP_WORK/bags/.ref/flow-mobile.png', fullPage: false });
console.log('ERRORS', [...new Set(errs)].slice(0,8));
await b.close();
