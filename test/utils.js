
const logData = name => ({ data, target }) => {
  console.log(name, { data });
  target.postMessage(data);
};

export default (self, prefix) => {
  self.addEventListener('message', logData(prefix));

  self.addEventListener('channel', event => {
    const { data, ports: [port] } = event;
    console.log(data);
    port.addEventListener('message', logData(`${prefix}-channel`));
  });
};
