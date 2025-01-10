//@ts-check

/**
 * @typedef {Object} Channel
 * @prop {string} id
 * @prop {MessagePort} port
 */

const { freeze } = Object;

/**
 * @param {EventTarget} self
 * @returns {Promise<Readonly<Channel>>}
 */
export const onmessage = self => new Promise(resolve => {
  self.addEventListener(
    'message',
    e => {
      const { data: id, ports: [port] } = /** @type {MessageEvent<any>} */(e);
      port.start();
      e.stopImmediatePropagation();
      resolve(freeze(/** @type {Channel} */({ id, port })));
    },
    { once: true }
  );
});
