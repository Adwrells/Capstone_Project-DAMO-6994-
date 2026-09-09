import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execFileAsync = promisify(execFile);

// We can scroll #main-workspace-canvas to the bottom before screenshot
// Or we can use a small script with node that uses CDP to scroll and screenshot
async function capture() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const screenshotPath = path.resolve('scratch/section08_scroll.png');
  
  // Launch Chrome with remote debugging
  const port = 9333;
  const child = execFile(chromePath, [
    '--headless=new',
    '--disable-gpu',
    `--remote-debugging-port=${port}`,
    'http://localhost:3000/?theme=light&stage=insights'
  ]);

  // Give Chrome 2.5 seconds to start and load page
  await new Promise(r => setTimeout(r, 2500));

  try {
    // Connect to CDP
    const listRes = await fetch(`http://127.0.0.1:${port}/json`);
    const pages = await listRes.json();
    const page = pages[0];
    const wsUrl = page.webSocketDebuggerUrl;

    const WebSocket = (await import('ws')).default;
    const ws = new WebSocket(wsUrl);

    await new Promise((resolve, reject) => {
      ws.on('open', resolve);
      ws.on('error', reject);
    });

    let msgId = 1;
    function send(method, params = {}) {
      return new Promise((resolve) => {
        const id = msgId++;
        const handler = (data) => {
          const res = JSON.parse(data.toString());
          if (res.id === id) {
            ws.off('message', handler);
            resolve(res.result);
          }
        };
        ws.on('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    // Scroll to section 08
    await send('Runtime.evaluate', {
      expression: `
        const el = document.getElementById('section-08-title');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
      `
    });

    await new Promise(r => setTimeout(r, 600));

    // Capture screenshot
    const res = await send('Page.captureScreenshot', { format: 'png' });
    const fs = await import('fs');
    fs.writeFileSync(screenshotPath, Buffer.from(res.data, 'base64'));
    console.log('Successfully captured section 08 to:', screenshotPath);

    ws.close();
  } catch (err) {
    console.error('Error during CDP capture:', err);
  } finally {
    child.kill();
  }
}

capture().catch(console.error);
