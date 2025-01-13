# @webreflection/channel

<sup>**Social Media Photo by [Pavan Trikutam](https://unsplash.com/@ptrikutam) on [Unsplash](https://unsplash.com/)**</sup>


This module goal is to simplify the creation and orchestration of a [MessageChannel](https://developer.mozilla.org/en-US/docs/Web/API/MessageChannel) between any main thread and either a *Worker* or a *SharedWorker*'s *port* counterpart.

## Worker

In a worker, the *port* is considered the worker itself. Every new channel is signaled through the `channel` global listener, which will have a `ports: [port]` field where the `port` is the one dedicated to the *Worker*.

**main.js**
```js
import { Worker } from '@webreflection/channel';

// exact same Worker API/reference
const w = new Worker('./worker.js');

// plus a createChannel method, usable at any time
const wc = w.createChannel();
wc.addEventListener('message', ({ data }) => {
  // any posted data through the channel
  // no listener on the worker will ever be affected
  // because this is a dedicated MessageChannel

  // close the channel whenever is needed
  wc.close();
});
wc.postMessage('hello');
```

**worker.js**
```js
import '@webreflection/channel/worker'; // ⬅️

// triggered when `createChannel()` happens on main.js
addEventListener('channel', ({ ports: [channel] }) => {
  channel.addEventListener('message', ({ data }) => {
    // will log: "hello"
    console.log(data);

    // will trigger the wc listener on main.js
    channel.postMessage('close');
  });
});
```

## SharedWorker

In this case the dance is identical except the logic is delegated to the `port`.

**main.js**
```js
import { SharedWorker } from '@webreflection/channel';

// exact same SharedWorker API/reference
const sw = new SharedWorker('./shared.js');

// the port has an extra utility
const swc = sw.port.createChannel();
swc.addEventListener('message', ({ data }) => {
  // exact same as it is for the worker case
  swc.close();
});
swc.postMessage('hello');
```

**shared.js**
```js
import '@webreflection/channel/shared'; // ⬅️

addEventListener('connect', ({ ports }) => {
  for (const port of ports) {
    // each connected thread exposes the API via each port
    // each port will trigger a `channel` event when `createChannel()`
    // is executed on the related port on the main thread
    port.addEventListener('channel', ({ ports: [channel] }) => {
      // exact same logic used for workers
      channel.addEventListener('message', ({ data }) => {
        // will log: "hello"
        console.log(data);

        // will trigger the wc listener on main.js
        channel.postMessage('close');
      });
    });
  }
});
```

### What Does This Module Solve?

Specially when you want to hook special libraries within a worker space, having just a single message/communication channel easily leads to potential issues, event type clashes, event data clashes, and whatnot.

I have been hooking myself in convoluted ways for various libraries for a long time and while that worked acceptably well, I never liked the inability to directly create, at any time, through the current worker or port a dedicated communication channel for all my needs, one that would never interfere with the rest of the communication that each worker, port, or library, could provide through the very same running code.

With this module all that should be easier and faster than ever:

  * easier because channels are not shared or reachable by other libraries, so these are somehow already *private* and safe by default
  * faster because there is no need, per each single received message, to brand check or guess some arguably fragile data structure which goal is to ensure no other listeners will be affected or logic triggered

This module has only one requirement and one constrain: it requires that any worker/port logic `import` this module on the top or ASAP and that the `channel` listener is not used for other purposes (at least until we'll have *symbols* usable as listeners, which would solve this only gotcha).

As a way to disambiguate `channel` messages dispatched by this library, it is still possible to brand-check that the field `ports` is within the received `event`, it is an *array*, and its length is exactly `1`.

Accordingly, if you have any logic that already uses a `channel` event name in your project, but you would like to enrich such project with this one too, this little snippet would do:

```js
addEventListener('channel', event => {
  if (event.ports?.length === 1) {
    event.stopImmediatePropagation();
    const [channel] = event.ports;
    // do what you want with the `port` channel
    return;
  }
  // the rest of your previous logic attached to `channel` event
});
```
