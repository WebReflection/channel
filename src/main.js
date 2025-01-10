//@ts-check

/**
 * @param {Worker|SharedWorker} self
 * @returns
 */
const messageChannel = self => {
  const { port1, port2 } = new MessageChannel;
  channel.set(self, port1);
  port1.start();
  return port2;
};

/** @type {WeakMap<SharedWorker|Worker,MessagePort>} */
export const channel = new WeakMap;

export class SharedWorker extends globalThis.SharedWorker {
  #id;
  get id() { return this.#id }

  /**
   * @param {string|URL} scriptURL
   * @param {WorkerOptions} [options]
   */
  constructor(scriptURL, options) {
    super(scriptURL, { ...options, type: 'module' });
    const { port } = this;
    port.start();
    this.#id = `Shared-${crypto.randomUUID()}`;
    port.postMessage(this.#id, [messageChannel(this)]);
  }
}

export class Worker extends globalThis.Worker {
  #id;
  get id() { return this.#id }

  /**
   * @param {string|URL} scriptURL
   * @param {WorkerOptions} [options]
   */
  constructor(scriptURL, options) {
    super(scriptURL, { ...options, type: 'module' });
    this.#id = `Worker-${crypto.randomUUID()}`;
    super.postMessage(this.#id, [messageChannel(this)]);
  }

  terminate() {
    channel.get(this)?.close();
    super.terminate();
  }
}
