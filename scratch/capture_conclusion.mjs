import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execFileAsync = promisify(execFile);

async function captureConclusion() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const screenshotPath = path.resolve('scratch/conclusion_exact.png');
  // Use a very tall window height (6000px) so the entire page renders from top to bottom
  const url = 'http://localhost:3000/?theme=light&stage=insights';
  
  await execFileAsync(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--window-size=1400,6000',
    '--virtual-time-budget=6000',
    `--screenshot=${screenshotPath}`,
    url
  ]);
  console.log(`Captured full page -> ${screenshotPath}`);
}

captureConclusion().catch(console.error);
