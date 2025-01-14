//@ts-check

const { isArray } = Array;

class ChannelEvent extends Event {
  #data;
  #port;

  /**
   * @param {string} type
   * @param {any} data
   * @param {MessagePort} port
   */
  constructor(type, data, port) {
    super(type);
    this.#data = data;
    this.#port = port;
  }

  get data() {
    return this.#data;
  }

  get ports() {
    return [this.#port];
  }
}

/**
 * @param {Event} event
 * @returns
 */
const stop = event => event.stopImmediatePropagation();

/**
 * @param {EventTarget} self
 */
export default self => {
  let init = true;
  let id = '';

  self.addEventListener('message', event => {
    const { data } = /** @type {MessageEvent<any>} */(event);
    if (init) {
      stop(event);
      init = false;
      id = data;
    }
    else if (isArray(data) && data.length === 2 && id === data[0]) {
      stop(event);
      const { ports: [port] } = /** @type {MessageEvent<any>} */(event);
      port.start();
      self.dispatchEvent(new ChannelEvent('channel', data[1], port));
    }
  });
};
