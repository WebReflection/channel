//@ts-check

class ChannelEvent extends Event {
  #port;

  /**
   * @param {string} type
   * @param {MessagePort} port
   */
  constructor(type, port) {
    super(type);
    this.#port = port;
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
export const onmessage = self => {
  let init = true;
  let id = '';

  self.addEventListener('message', event => {
    const { data } = /** @type {MessageEvent<any>} */(event);
    if (init) {
      stop(event);
      init = false;
      id = data;
    }
    else if (id === data) {
      stop(event);
      const { ports: [port] } = /** @type {MessageEvent<any>} */(event);
      port.start();
      self.dispatchEvent(new ChannelEvent('channel', port));
    }
  });
};
