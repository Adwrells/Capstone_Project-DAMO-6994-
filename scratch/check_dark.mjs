import fs from 'fs';
import path from 'path';

function checkDir(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (f === 'node_modules' || f === '.git' || f === 'dist') continue;
    if (fs.statSync(p).isDirectory()) checkDir(p);
    else if (p.endsWith('.tsx') || p.endsWith('.ts') || p.endsWith('.html')) {
      const txt = fs.readFileSync(p, 'utf8');
      const lines = txt.split('\n');
      lines.forEach((l, idx) => {
        if (/(["'`\s])dark(["'`\s])/.test(l) && !l.includes('dark:') && !l.includes('isDarkMode') && !l.includes('dark ?') && !l.includes("=== 'dark'")) {
          console.log(`${p}:${idx + 1}: ${l.trim()}`);
        }
      });
    }
  }
}

checkDir('frontend/src');
console.log('Done scanning.');
