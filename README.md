# Spokes.js

Spokes.js facilitates coordinating events between webpage lifecycle events and single-page applications (SPAs) or third party analytics platforms (e.g. Google Tag Manager's data layer).

**Pub/sub events** allow for the basis of coordinating events and payloads between components.

**State change events** are published to indicate when global state data is updated.

**Lifecycle events** are automatically processed on page load and events are published to notify about `PageLoaded` and `UTMLoaded`.

**Promises** allow resolving lifecycle events, even if they've already ocurred, in order to retrieve the related data as needed. Note, however, that lifecycle events arre also published and can be subscribed to as-they-happen with pub/sub.

## Setup

Setup is pretty straight forward. You need an instance of `Spokes` that is shared by all components that need to communicate with each other.

```es6
import Spokes from 'Spokes';
import Broker from 'Spokes/pubsub/Broker';
import document from 'Spokes/dom/document';
import window from 'Spokes/dom/window';

// Crate a global instance to use by your SPA or analytics data layer
const spokes = new Spokes({
  // the document to load
  document: document,
  // facilitates publish/subscrribe
  broker: new Broker()
});

// You could make this a global variable
window._spokes = spokes;
```

## Publish/Subscribe Events

You can easily  coordinate events and data between  components with publish/subscribe. Let's start with subscribing.

```es6
// Subscribe to the page load event that Spokes emits automatically.
// Note that the last argument is a `Subscription` instance, which
// allows you to call `subscription.unsubscribe()` to unsubscribe.
spokes.subscribe('PageLoaded', (document, subscription) => console.log('PageLoaded fired', document));

// You can also subscribe and receive the last event in case you missed it
spokes.subscribe('PageLoaded', document => {
  console.log('PageLoaded fired', document);
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

## Global State & State Changes

It's simple to manage global state by utilizing a key/value store. Any key that is added or value that is updated emits a `StateChanged` event. An event is also emitted for each key, so if you have a `UserProfile` key, then the `StateChanged:UserProfile` event can also be subscribed to for changes.

```es6
// subscribe to changes to global state
spokes.subscribe('StateChanged:UserProfile', value => console.log('UTM changed', value));

// update the global state, which will publish both `StateChanged` and `StateChanged:UserProfile` events.
spokes.setState('UserProfile', { name: 'John Doe', email: 'john@doe.com' });

// get the latest value
const userProfile = spokes.getState('UserProfile');
```

## Page Lifecycle Events

Page lifecycle events differ slightly from publish/subscribe events because they are triggered once per page. These events can be registered and then resolved using a `Promise`. No matter when you "subscribe" to the event, you'll receive a value whether the value was already  resolved or has yet to be resolved. Note, however, that they do also publish an event with pub/sub when  initally resolved, for any subscribers to the event. (Pub/sub is the underlying event handling that drives Spokes.js.)

Built-in lifecycle events are `PageLoaded` and `UTMLoaded`.

```es6
// You may want to know when the page is loaded. This can  be called at any time and the value will
// be passed to the callback when it's available. This is different from subscribing to pub/sub
// because if you subscribe too late, you may miss events.
spokes.lifecycle('PageLoaded').then((...payload) => console.log('PageLoaded resolved', ...payload));

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
```

