# Spokes.js

Spokes.js facilitates coordinating events between webpage lifecycle events and single-page applications (SPAs) or third party analytics platforms (e.g. Google Tag Manager's data layer).

- **Pub/sub events** allow for the basis of coordinating events and payloads between components.
- **State change events** are published to indicate when global state data is updated.
- **Lifecycle events** are automatically processed on page load and events are published to notify about `Page:Loaded` and `Page:QueryStringParsed`.
- **Promises** allow resolving lifecycle events, even if they've already ocurred, in order to retrieve the related data as needed. Note, however, that lifecycle events arre also published and can be subscribed to as-they-happen with pub/sub.

## Install

Run `npm install spokes` to add this [package](https://www.npmjs.com/package/spokes) to your project (package.json).

## Development

- Run `npm install` to get all dependencies installed.
- Run `npm run start` to view the [demo](./src/demo.js).
    - Then click this demo link with UTM parameters: http://localhost:8080/?utm_campaign=my%20campaign&utm_medium=email
- Run `npm run build` to build the bundle for production.
    - `build/demo.bundle.js` contains the demo code.
    - `build/main.bundle.js` contains the bundle to be included for global `window._spokes` access.

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

// Register the Page lifecycle
spokes.register(new Page(document));

// You could make this a global variable
window._spokes = spokes;
```

### Publish/Subscribe Events

You can easily coordinate events and data between components with publish/subscribe. Let's start with subscribing.

```es6
// Subscribe to the page load event that Spokes emits automatically.
// Note that the last argument is a `Subscription` instance, which
// allows you to call `subscription.unsubscribe()` to unsubscribe.
spokes.subscribe('Page:Loaded', (document, subscription) => console.log('Page:Loaded fired', document));

// You can also subscribe and receive the last event in case you missed it
spokes.subscribe('Page:Loaded', document => {
  console.log('Page:Loaded fired', document);
}, {
  // Add the option to receive the last event
  withLastEvent: true
});

// Alternatively, subscribe to all events
spokes.subscribeAll((eventName, ...payload) => console.log(eventName, ...payload));
```

You can publish events to notify other components of what's occurred.

```es6
// You can publish as many payload arguments as you want,
// as long as the subscribers know how to handle the data.
spokes.publish('UserRegistered', 'John', 'Doe', { email: 'john@doe.com', phone: '123-456-7890' });
```

### Global State & State Changes

It's simple to manage global state by utilizing a key/value store. Any key that is added or value that is updated emits a `StateChanged` event. An event is also emitted for each key, so if you have a `UserProfile` key, then the `StateChanged:UserProfile` event can also be subscribed to for changes.

```es6
// Subscribe to changes to global state
spokes.subscribe('StateChanged:UserProfile', value => console.log('User info changed', value));

// Update the global state, which will publish both `StateChanged` 
// and `StateChanged:UserProfile` events.
spokes.setState('UserProfile', { name: 'John Doe', email: 'john@doe.com' });

// get the latest value
const userProfile = spokes.getState('UserProfile');
```

### Lifecycle Events

Lifecycle events differ slightly from publish/subscribe events because they are triggered once. These events are registered and then resolved using a `Promise`. No matter when you "subscribe" to the event, you'll receive a value whether the value was resolved previously or has yet to be resolved. Note, however, that these events are also published with pub/sub when resolved the first time, for any pub/sub subscribers of the event. (Pub/sub is the underlying event handling that drives Spokes.js.)

Built-in lifecycle events are `Page:Loaded` and `Page:QueryStringParsed`. These lifecycle events are registered individually or you can register an  object that responds to the `register` method. The default lifecycle for the page is encapsulated in `new Page()` and registered with the `Spokes` instance.

```es6
// As seen above, we can register a lifecycle like this.
spokes.register(new Page(document));

// Within that `register` method, the following types of things are done:

// You may want to know when the page is loaded. This can  be called
// at any time and the value will be passed to the callback when it's
//  available. This is different from subscribing to pub/sub because
// if you subscribe too late, you may miss events.
spokes.lifecycle('Page:Loaded').then((...payload) => console.log('Page:Loaded resolved', ...payload));

// Here's an example of registering a lifecycle event, such  as telling other components
// when your SPA is loaded and  ready.
spokes.registerLifecycleEvent('SPALoaded', (resolve, reject) => {
  // Do whatever needs to be done to finish loading your SPA,
  // then  trigger `resolve` to pass back a payload to subscribers.
  // If there is a failure, pass back info to `reject`.
  if (success) {
    resolve(/*...*/);
  } else {
    reject(/*...*/);
  }
});

// Another ecommerce-related lifecycle event might be `CheckoutCompleted`,
// if it doesn't happen more than once per page load.
spokes.registerLifecycleEvent('CheckoutCompleted', (resolve, reject) => { /*...*/ });

// Note that we are using the `Promise` class, which allows you to
// subscribe to the result with `then`.
// You can also subscribe to a failure with `catch`.
```

