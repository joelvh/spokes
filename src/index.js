import List from './lib/List';
import ValueStack from './lib/ValueStack';
import Broker from './pubsub/Broker';
import Lifecycle from './Lifecycle';

export default class Spokes {
  constructor() {
    this.broker = new Broker();
    this.lifecycles = new List();
    this.stateStack = new ValueStack();

    this.stateTopic = this.broker.registerTopic('StateChanges');
  }

  // Lifecycle event resolving

  registerLifecycle(name, startLifecycle) {
    if (this.lifecycles.has(name)) {
      throw new Error('Lifecycle already registered: '+name);
    }

    const topic = this.broker.registerTopic(name);
    const lifecycle = new Lifecycle(name, topic, this);

    startLifecycle(lifecycle);

    this.lifecycles.add(name, lifecycle);

    return this;
  }

  when(lifecycleName, eventName) {
    return this.lifecycles.fetch(lifecycleName).when(eventName);
  }

  // State

  setState(key, value) {
    this.stateStack.append(key, value);
    this.stateTopic.publish(key, value);
  }

  getState(key) {
    return this.stateStack.fetch(key).pop();
  }

  // Pub/Sub

  subscribe(topic, handler, options) {
    return this.broker.topic(topic).subscribe(handler, options);
  }

  subscribeAll(handler, options) {
    return this.broker.globalTopic.subscribe(handler, options);
  }

  publish(topic, key, value) {
    this.broker.topic(topic).publish(key, value);
  }
}