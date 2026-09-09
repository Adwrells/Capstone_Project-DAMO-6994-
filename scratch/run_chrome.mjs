import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

async function test() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const url = 'file:///C:/Users/bhara/OneDrive/Desktop/Capstone_Project-DAMO-6994-/Capstone_Project-DAMO-6994-/Capstone_Project-DAMO-6994-/scratch/test_selector.html';
  const { stdout, stderr } = await execFileAsync(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--dump-dom',
    url
  ]);
  console.log('DOM OUTPUT:', stdout);
}

test().catch(console.error);
