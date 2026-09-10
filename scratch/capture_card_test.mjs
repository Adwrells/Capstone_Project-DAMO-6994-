import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execFileAsync = promisify(execFile);

async function capture() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const screenshotPath = path.resolve('scratch/test_conclusion_card.png');
  const url = 'file:///' + path.resolve('scratch/test_conclusion_card.html').replace(/\\/g, '/');
  
  await execFileAsync(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--window-size=1000,850',
    `--screenshot=${screenshotPath}`,
    url
  ]);
  console.log(`Saved screenshot to -> ${screenshotPath}`);
}

capture().catch(console.error);
