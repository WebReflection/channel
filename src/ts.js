// ⚠️ this file exists solely to satisfy JSDoc TS in SharedWorker
export class MessagePort extends globalThis.MessagePort {
  /**
   * @param {any} [data=null]
   * @returns
   */
  createChannel(data = null) {
    console.never?.(data);
    return (new MessageChannel).port1;
  }
}
