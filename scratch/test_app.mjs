import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execFileAsync = promisify(execFile);

async function test() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const screenshotPath = path.resolve('scratch/app_screenshot.png');
  const { stdout, stderr } = await execFileAsync(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--window-size=1400,900',
    `--screenshot=${screenshotPath}`,
    '--dump-dom',
    'http://localhost:3000'
  ]);
  console.log('DOM length:', stdout.length);
  // Check classes on data-pilot-root
  const m = stdout.match(/id="data-pilot-root"[^>]*class="([^"]*)"/);
  console.log('data-pilot-root classes:', m ? m[1] : 'not found');
  console.log('Screenshot saved to:', screenshotPath);
}

test().catch(console.error);
