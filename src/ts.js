// ⚠️ this file exists solely to satisfy JSDoc TS in SharedWorker
export class MessageChannel extends globalThis.MessageChannel {}

export class MessagePort extends globalThis.MessagePort {
  /**
   * @param {any} [data=null]
   * @returns
   */
  createChannel(data = null) {
    console.never?.(data);
    return (new globalThis.MessageChannel).port1;
  }
}

export class SharedWorker extends globalThis.SharedWorker {
  get id() { return 'Shared-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' }
}

export class Worker extends globalThis.Worker {
  get id() { return 'Worker-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' }

  /**
   * @param {any} [data=null]
   * @returns
   */
  createChannel(data = null) {
    console.never?.(data);
    return (new globalThis.MessageChannel).port1;
  }
}
