//@ts-check

// ⚠️ this file exists solely to satisfy JSDoc TS in SharedWorker

import { Worker as W, SharedWorker as SW } from 'as-module';

export class MessageChannel extends globalThis.MessageChannel {}

export class MessagePort extends globalThis.MessagePort {
  /**
   * @param {any} [data=null]
   * @returns
   */
  createChannel(data = null) {
    data?.never;
    return (new globalThis.MessageChannel).port1;
  }
}

export class SharedWorker extends SW {
  get id() { return 'Shared-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' }

  /**
   * @param {string|URL} scriptURL
   * @param {string|WorkerOptions} [options]
   */
  constructor(scriptURL, options) {
    super(scriptURL, options);
  }
}

export class Worker extends W {
  get id() { return 'Worker-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' }
  
  /**
   * @param {string|URL} scriptURL
   * @param {WorkerOptions} [options]
   */
  constructor(scriptURL, options) {
    super(scriptURL, options);
  }

  /**
   * @param {any} [data=null]
   * @returns
   */
  createChannel(data = null) {
    data?.never;
    return (new globalThis.MessageChannel).port1;
  }
}
