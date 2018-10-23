import List from '../lib/List';
import debug from '../dom/debug';

export default class Lifecycle {
  constructor(name, topic, spokes) {
    this.name = name;
    this.topic = topic;
    this.spokes = spokes;
    this.events = new List();
  }

  registerEvent(name, executor) {
    debug('Lifecycle.registerEvent', name);

    if (this.events.has(name)) {
      throw new Error('Lifecycle event already registered: '+name);
    }

    const promise = new Promise((resolve, reject) => {
      executor((data) => {
        resolve(data);
        this.topic.publish(name, data);
      }, reject);
    });

    this.events.add(name, promise);

    return promise;
  }

  when(event) {
    debug('Lifecycle.when', event);
    
    if (!this.events.has(event)) {
      throw new Error('Unknown lifecycle event name: '+event);
    }

    return this.events.fetch(event);
  }
}