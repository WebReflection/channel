import '../src/shared.js';
import logger from './utils.js';

addEventListener('connect', ({ ports }) => {
  for (const port of ports)
    logger(port, 'shared');
});
