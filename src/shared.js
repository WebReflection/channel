//@ts-check

import { onmessage } from './utils.js';

addEventListener('connect', event => {
  for (const port of /** @type {MessageEvent<any>} */(event).ports) {
    port.start();
    onmessage(port);
  }
});
