//@ts-check

const { defineProperties } = Object;

/**
 * @param {MessagePort[]} channels
 * @param {(ports: MessagePort[]) => void} post
 * @returns 
 */
const createChannel = (channels, post) => {
  const { port1, port2 } = new MessageChannel;
  channels.push(port1);
  port1.start();
  post([port2]);
  return port1;
};

/**
 * @param {MessagePort[]} channels
 */
const terminate = channels => {
  for (const channel of channels)
    channel.close();
};

export class SharedWorker extends globalThis.SharedWorker {
  #id;
  get id() { return this.#id }

  /**
   * @param {string|URL} scriptURL
   * @param {WorkerOptions} [options]
   */
  constructor(scriptURL, options) {
    super(scriptURL, { ...options, type: 'module' });
    this.#id = `Shared-${crypto.randomUUID()}`;
    /** @type {MessagePort[]} */
    const channels = [];
    const { port } = this;
    const { close, postMessage } = port;
    defineProperties(port, {
      createChannel: {
        value: () => createChannel(
          channels,
          postMessage.bind(port, this.#id)
        )
      },
      close: {
        value() {
          terminate(channels);
          close.call(port);
        }
      }
    }).start();
    port.postMessage(this.#id);
  }
}

export class Worker extends globalThis.Worker {
  /** @type {MessagePort[]} */
  #channels = [];

  #id;
  get id() { return this.#id }

  /**
   * @param {string|URL} scriptURL
   * @param {WorkerOptions} [options]
   */
  constructor(scriptURL, options) {
    super(scriptURL, { ...options, type: 'module' });
    this.#id = `Worker-${crypto.randomUUID()}`;
    super.postMessage(this.#id);
  }

  createChannel() {
    return createChannel(
      this.#channels,
      super.postMessage.bind(this, this.#id)
    );
  }

  terminate() {
    terminate(this.#channels);
    super.terminate();
  }
}
