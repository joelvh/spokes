import List from './lib/List';
import ValueStack from './lib/ValueStack';
import Broker from './pubsub/Broker';
import debug from './dom/debug';
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
    debug('Spokes.registerLifecycle', name);
    
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
    debug('Spokes.when', lifecycleName, eventName);
    return this.lifecycles.fetch(lifecycleName).when(eventName);
  }

  // State

  setState(name, value) {
    debug('Spokes.setState', name, value);
    this.stateStack.append(name, value);
    this.stateTopic.publish(name, value);
  }

  getState(name) {
    debug('Spokes.getState', name);
    return this.stateStack.fetch(name).pop();
  }

  // Pub/Sub

  subscribe(topicName, handler, options) {
    return this.broker.topic(topicName).subscribe(handler, options);
  }

  subscribeAll(handler, options) {
    return this.broker.globalTopic.subscribe(handler, options);
  }

  publish(topic, event, data) {
    this.broker.topic(topic).publish(event, data);
  }
}