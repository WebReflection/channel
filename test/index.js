import { SharedWorker, Worker, channel } from '../src/main.js';

const sw = new SharedWorker('./shared.js');
sw.port.postMessage('default');
channel.get(sw).postMessage('channel');

const wc = new Worker('./worker.js');
wc.postMessage('default');
channel.get(wc).postMessage('channel');
