import channel from '../src/worker.js';

const logData = ({ data }) => console.log({ data });
addEventListener('message', logData);

const { id, port } = await channel;
console.log('worker', { id, port });
port.addEventListener('message', logData);
