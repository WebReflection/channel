export class MessageChannel extends globalThis.MessageChannel {
}
export class MessagePort extends globalThis.MessagePort {
    /**
     * @param {any} [data=null]
     * @returns
     */
    createChannel(data?: any): globalThis.MessagePort;
}
export class SharedWorker {
    /**
     * @param {string|URL} scriptURL
     * @param {string|WorkerOptions} [options]
     */
    constructor(scriptURL: string | URL, options?: string | WorkerOptions);
    get id(): string;
}
export class Worker {
    /**
     * @param {string|URL} scriptURL
     * @param {WorkerOptions} [options]
     */
    constructor(scriptURL: string | URL, options?: WorkerOptions);
    get id(): string;
    /**
     * @param {any} [data=null]
     * @returns
     */
    createChannel(data?: any): globalThis.MessagePort;
}
