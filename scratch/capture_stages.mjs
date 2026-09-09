import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execFileAsync = promisify(execFile);

const STAGES = ['about', 'clean', 'explorer', 'analytics', 'dashboard', 'insights', 'export'];

async function captureStage(stage) {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const screenshotPath = path.resolve(`scratch/stage_${stage}_light.png`);
  const url = `http://localhost:3000/?theme=light&stage=${stage}`;
  
  await execFileAsync(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--window-size=1400,900',
    `--screenshot=${screenshotPath}`,
    url
  ]);
  console.log(`Captured ${stage} -> ${screenshotPath}`);
}

async function run() {
  for (const s of ['about', 'clean', 'dashboard', 'export']) {
    try {
      await captureStage(s);
    } catch (e) {
      console.error(`Failed ${s}:`, e.message);
    }
  }
}

run();
