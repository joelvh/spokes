# Spokes.js

Spokes.js facilitates coordinating lifecycle events between webpage lifecycle and the lifecycles of single-page applications (SPAs) or third party analytics platforms (e.g. Google Tag Manager's data layer).

- **Pub/sub events** allow for the basis of coordinating events and sharing data between components. Events are published to topics that can be subscribed to.
- **State change events** are published to indicate when global state data is updated.
- **Lifecycle events** can be defined for each set of events that you want to track and coordinate. By default, webpage (`Page`) lifecycle events are automatically processed on page load and pub/sub events are published to notify about `Loaded` and `QueryStringParsed` to hook into.
- **Promises** allow resolving lifecycle events, even if they've already ocurred, in order to retrieve the related data as needed. Note, however, that lifecycle events arre also published and can be subscribed to as-they-happen with pub/sub.

## Install

Run `npm install spokes` to add this [package](https://www.npmjs.com/package/spokes) to your project (package.json).

## Development

- Run `npm install` to get all dependencies installed.
- Run `npm run serve-webpack` to view the [demo](./src/demo.js).
    - Then click this demo link with UTM parameters: http://localhost:8080/?utm_campaign=my%20campaign&utm_medium=email
- Run `npm run build` to build the bundle for production.
    - `build/webpack/js/demo.bundle.js` and `build/rollup/js/demo.bundle.js` contain the demo code.
    - `build/webpack/js/main.bundle.js` and `build/rollup/js/main.bundle.js` contain the bundle to be included for global `window._spokes` access.

### TODO

- Polyfills for ES6 and other browser things that may not be supported by all (e.g. `Promise`)
- Add GTM Data Layer integration
- Add common analytics event integration (e.g. `track` and `identify`)
- Add React integration to coordinate between webpage (e.g. `window._spokes`) and React components (or other SPA frameworks)
- Evaluate if we use [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) (and related polyfill) rather than the [ValueStack](./src/Spokes/lib/ValueStack.js) internals
- Evaluate  if we use [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) (and related polyfill) rather than the [List](./src/Spokes/lib/List.js) internals

## Getting Started

Setup is pretty straight forward. You need an instance of `Spokes` that is shared by all components that need to communicate with each other.

```es6
import Spokes from 'Spokes';
import Page from 'Spokes/lifecycle/Page';
import window from 'Spokes/dom/window';
import document from 'Spokes/dom/document';

// Create a global instance to use by your SPA or analytics data layer
const spokes = new Spokes();

// Register the Page lifecycle, which hooks into pub/sub and the ability for
// components to resolve the result of specific page events (`Loaded` and `QueryStringParsed`)
spokes.registerLifecycle('Page', lifecycle => new Page(document).load(lifecycle));

// You could make this a global variable
window._spokes = spokes;
```

### Publish/Subscribe Events

You can easily coordinate events and data between components with publish/subscribe. Events are published to topics, and you can subscribe to topics. Within the payload value are `topic`, `key` and `value`.

```es6
// Subscribe to the `Page` lifecycle topic and filter on the load event that
// Spokes emits automatically. Note that the last argument is a
// `Subscription` instance, which allows you to call
// `subscription.unsubscribe()` to unsubscribe.
spokes.subscribe('Page', ({ topic, event, value }, subscription) => {
  if (event == 'Loaded') console.log('Page:Loaded fired', value);
});

// You can also subscribe and receive the last event published to the
// topic in case you missed it, using  the `withLastEvent` option.
spokes.subscribe('Page', document => {
  if (event == 'Loaded') console.log('Page:Loaded fired', document);
}, { withLastEvent: true });

// Alternatively, subscribe to all topics. In this case,
// the original event is nested inside the payload's `value` property.
spokes.subscribeAll((payload) => {
  const { topic, key, value } = payload.value;
  console.log(topic, key, value);
});
```

You can publish events to topics to notify other components of what's occurred.

```es6
// You can publish to a topic with  an  event name and a data value.
spokes.publish('Some Topic', 'UserRegistered', { name: 'John Doe', email: 'john@doe.com', phone: '123-456-7890' });
```

### Global State & State Changes

It's simple to manage global state by utilizing a key/value store. Any key that is added or value that is updated emits an event to the `StateChanged` topic.

```es6
// Subscribe to changes to global state and filter on `UserProfile`.
spokes.subscribe('StateChanged', ({ topic, event, data }) => {
  if (event == 'UserProfile') console.log('User info changed', value);
});

// Update the global state, which will publish an event to the
// `StateChanged` topic.
spokes.setState('UserProfile', { name: 'John Doe', email: 'john@doe.com' });

// Get the latest value.
const userProfile = spokes.getState('UserProfile');
```

### Lifecycle Events

Lifecycle events differ slightly from publish/subscribe events because they are triggered once. These events are registered and then resolved using a `Promise`. No matter when you "subscribe" to the event, you'll receive a value whether the value was resolved previously or has yet to be resolved. Note, however, that these events are also published with pub/sub when resolved the first time, for any pub/sub subscribers of the event. (Pub/sub is the underlying event handling that drives Spokes.js.)

Each lifecycle has it's own pub/sub topic. Built-in lifecycle `Page` topic has events `Loaded` and `QueryStringParsed`. Lifecycles are registered by name (e.g. `Page`) and events like these are registered to that lifecycle. The default lifecycle for the page is encapsulated in `new Page()` and registered with a `Lifecycle` instance.

```es6
// As seen above, we can register a lifecycle like this, by
// giving it a name and providing a factory method to setup a
// `Lifecycle` instance by registering events (e.g. `Loaded`).
spokes.registerLifecycle('Page', lifecycle => new Page(document).load(lifecycle));

// Within that `registerLifecycle` method, the following types of things are done:

// You may want to know when the page is loaded. This can be called
// at any time and the value will be passed to the callback when it's
// available. This is different from subscribing to pub/sub because
// if you subscribe to a pub/sub topic too late, you may miss events.
// Note: `when` returns a Promise, for which you can call `then` or  `catch`.
spokes.when('Page', 'Loaded').then(({ topic, event, data }) => console.log('Page:Loaded resolved'));

// Here's an example of registering a lifecycle event, such as telling other components
// when your SPA is loaded and  ready.
spokes.registerLifecycle('SPA', lifecycle => {
  lifecycle.registerEvent('Initialized', (resolve, reject) => {
    // Do whatever needs to be done to finish loading your SPA,
    // then trigger `resolve` to pass back a payload to subscribers.
    // If there is a failure, call `reject`.
    if (success) {
      resolve(/*...*/);
    } else {
      reject(/*...*/);
    }
  });
});

// Another ecommerce-related lifecycle event might be `CheckoutCompleted`,
// if it doesn't happen more than once per page load.
spokes.registerLifecycle('Ecommerce', lifecycle => {
  lifecycle.registerEvent('CheckoutCompleted', (resolve, reject) => { /*...*/ });
});
```
