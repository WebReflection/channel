import { SharedWorker, Worker } from '../src/main.js';

const results = [];
const logData = name => ({ data }) => {
  console.log(`${name}-back`, { data });
  if (results.push(`${name}-back`) === 4) {
    results.sort();
    document.body.innerHTML = `<pre>${results.join('\n')}</pre>✅`;
    sw.port.close();
    wc.terminate();
  }
};

const sw = new SharedWorker('./shared.js');
sw.port.addEventListener('message', logData('shared'));
sw.port.postMessage('default');

const swc = sw.port.createChannel();
swc.addEventListener('message', logData('shared-channel'));
swc.postMessage('channel');

const wc = new Worker('./worker.js');
wc.addEventListener('message', logData('worker'));
wc.postMessage('default');

const wcc = wc.createChannel();
wcc.addEventListener('message', logData('worker-channel'));
wcc.postMessage('channel');
