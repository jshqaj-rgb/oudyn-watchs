import { chromium } from 'playwright';
const dir='/Users/lee/Downloads/cuyana';
const b = await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const ctx = await b.newContext({viewport:{width:1440,height:900}});
const p = await ctx.newPage();
await p.goto('file://'+dir+'/Bags – Cuyana.html',{waitUntil:'load',timeout:60000}).catch(()=>{});
await p.waitForTimeout(2000);
const res = await p.evaluate(()=>{
  const pick=(sel)=>{const el=document.querySelector(sel); if(!el) return null; const c=getComputedStyle(el); const r=el.getBoundingClientRect(); return {sel, text:(el.textContent||'').trim().slice(0,60), font:c.fontFamily,size:c.fontSize,weight:c.fontWeight,ls:c.letterSpacing,lh:c.lineHeight,color:c.color,bg:c.backgroundColor,pad:c.padding,rect:[Math.round(r.width),Math.round(r.height)], tt:c.textTransform};};
  const sels=['.AnnouncementBar','.AnnouncementBar__ContentHeading','.Header','.Header__MainNav a','.Header__LogoImage','.ProductItem__Title','.ProductItem__Price','body','h1','.PageTitle','.SectionHeader__Heading','.Button','.ProductItem__ColorSwatchList'];
  return sels.map(s=>{const x=pick(s); return x;}).filter(Boolean);
});
console.log(JSON.stringify(res,null,1));
const fonts = await p.evaluate(()=>Array.from(document.styleSheets).flatMap(s=>{try{return Array.from(s.cssRules)}catch(e){return []}}).filter(r=>r.type===5).map(r=>r.cssText.slice(0,200)));
console.log("FONTFACES",fonts.slice(0,5));
await b.close();
