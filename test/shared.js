import ports from '../src/shared.js';

ports.addEventListener(
  'connect',
  async event => {
    const logData = ({ data }) => console.log({ data });
    event.port.addEventListener('message', logData);

    const { id, port } = await event.channel;
    console.log('shared', event.port, { id, port });
    port.addEventListener('message', logData);
  }
);
