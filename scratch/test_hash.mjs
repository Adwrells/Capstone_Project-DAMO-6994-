import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execFileAsync = promisify(execFile);

async function captureHash() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const screenshotPath = path.resolve('scratch/section08_hash.png');
  const url = 'http://localhost:3000/?theme=light&stage=insights#section-08-title';
  
  await execFileAsync(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--window-size=1400,900',
    '--virtual-time-budget=6000',
    `--screenshot=${screenshotPath}`,
    url
  ]);
  console.log(`Captured hash screenshot -> ${screenshotPath}`);
}

captureHash().catch(console.error);
