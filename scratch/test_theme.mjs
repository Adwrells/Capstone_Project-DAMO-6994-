import { JSDOM } from 'jsdom';
import fs from 'fs';

const css = fs.readFileSync('dist/assets/index-DTsrebHL.css', 'utf8');

const html = `<!DOCTYPE html>
<html>
<head><style>${css}</style></head>
<body>
  <div id="data-pilot-root" class="bg-[#F1F5FB] text-[#0F172A]">
    <div id="card" class="bg-white dark:bg-[#111e35]">Test Card</div>
  </div>
</body>
</html>`;

const dom = new JSDOM(html);
const card = dom.window.document.getElementById('card');
const computedLight = dom.window.getComputedStyle(card);
console.log('LIGHT MODE card backgroundColor:', computedLight.backgroundColor);

dom.window.document.getElementById('data-pilot-root').className = 'dark bg-[#080E1C] text-slate-100';
const computedDark = dom.window.getComputedStyle(card);
console.log('DARK MODE card backgroundColor:', computedDark.backgroundColor);
