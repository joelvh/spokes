import List from './lib/List';
import ValueStack from './lib/ValueStack';
import PageLoad from './events/PageLoad';
import parseQueryString from './parseQueryString';

export default class Spokes {
  constructor({ document, broker }) {
    this.broker = broker;
    
    this.lifecycleEvents= new List();
    this.state = new ValueStack();

    // Setup page lifecycle
    
    this.registerLifecycleEvent('PageLoaded', new PageLoad(document).executor);
    this.registerLifecycleEvent('UTMLoaded', (resolve, reject) => {
      this.lifecycle('PageLoaded').then(document => resolve(parseQueryString(document.location.search))).catch(reject);
    });

    this.lifecycle('UTMLoaded').then(qs => this.setState('UTM', qs));
  }

  // Lifecycle event resolving

  registerLifecycleEvent(name, executor) {
    console.log('registerLifecycleEvent', name, 'executor()');
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
    }
  }

  // State

  setState(name, value) {
    console.log('setState', name, value);
    this.state.append(name, value);
    this.broker.publish('StateChanged', name, value);
    this.broker.publish('StateChanged:'+name, value);
  }

  getState(name) {
    console.log('getState', name);
    console.log('this.state.fetch('+name+')', this.state.fetch(name));
    return this.state.fetch(name).pop();
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