import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execFileAsync = promisify(execFile);

async function captureWithData(stage) {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const screenshotPath = path.resolve(`scratch/stage_${stage}_with_data_light.png`);
  const url = `http://localhost:3000/?theme=light&stage=${stage}`;
  
  // Use --virtual-time-budget=6000 to allow React useEffect to fetch and populate preloaded datasets
  await execFileAsync(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--window-size=1400,1000',
    '--virtual-time-budget=6000',
    `--screenshot=${screenshotPath}`,
    url
  ]);
  console.log(`Captured ${stage} with data -> ${screenshotPath}`);
}

async function run() {
  for (const s of ['explorer', 'analytics', 'dashboard', 'insights']) {
    try {
      await captureWithData(s);
    } catch (e) {
      console.error(`Failed ${s}:`, e.message);
    }
  }
}

run();
