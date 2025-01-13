
const logData = name => ({ data, target }) => {
  console.log(name, { data });
  target.postMessage(data);
};

export default (self, prefix) => {
  self.addEventListener('message', logData(prefix));

  self.addEventListener('channel', event => {
    const { ports: [port], target } = event;
    console.assert(port === target, 'port and target are the same');
    port.addEventListener('message', logData(`${prefix}-channel`));
  });
};
