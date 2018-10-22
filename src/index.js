import List from './lib/List';
import ValueStack from './lib/ValueStack';
import Broker from './pubsub/Broker';
import debug from './dom/debug';

export default class Spokes {
  constructor() {
    this.broker = new Broker();
    this.lifecycleEvents= new List();
    this.stateStack = new ValueStack();
  }

  // Lifecycle event resolving

  register(lifecycle) {
    debug('register', lifecycle.constructor.name);
    lifecycle.register(this);
  }

  registerLifecycleEvent(name, executor) {
    debug('registerLifecycleEvent', name);
    const promise = new Promise((resolve, reject) => {
      executor((...args) => {
        resolve(...args);
        this.publish(name, ...args);
      }, reject);
    });

    this.lifecycleEvents.add(name, promise);

    return promise;
  }

  lifecycle(name) {
    if (this.lifecycleEvents.has(name)) {
      return this.lifecycleEvents.fetch(name);
    } else {
      throw new Error('Unknown lifecycle event name given: '+name);
    }
  }

  // State

  setState(name, value) {
    debug('setState', name, value);
    this.stateStack.append(name, value);
    this.broker.publish('StateChanged', name, value);
    this.broker.publish('StateChanged:'+name, value);
  }

  getState(name) {
    debug('getState', name);
    return this.stateStack.fetch(name).pop();
  }

  // Pub/Sub

  subscribe(name, handler, ...args) {
    this.broker.subscribe(name, handler, ...args);
  }

  subscribeAll(handler, ...args) {
    this.broker.subscribeAll(handler, ...args);
  }

  publish(name, ...payload) {
    this.broker.publish(name, ...payload);
  }
}