//@ts-check

import { onmessage } from './utils.js';

class ChannelEvent extends Event {
  #port;
  #channel;

  get port() { return this.#port }
  get channel() { return this.#channel }

  /**
   * @param {string} type
   * @param {MessagePort} port
   * @param {Promise<Readonly<import("./utils.js").Channel>>} channel
   */
  constructor(type, port, channel) {
    super(type);
    this.#port = port;
    this.#channel = channel;
  }
}

const ports = new EventTarget;
export default ports;

addEventListener(
  'connect',
  event => {
    for (const port of /** @type {MessageEvent<any>} */(event).ports) {
      port.start();
      ports.dispatchEvent(
        new ChannelEvent(event.type, port, onmessage(port))
      );
    }
  }
);
