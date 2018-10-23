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
      executor((value) => {
        resolve(value);
        this.topic.publish(name, value);
      }, reject);
    });

    this.events.add(name, promise);

    return promise;
  }

  when(name) {
    debug('Lifecycle.when', name);
    
    if (!this.events.has(name)) {
      throw new Error('Unknown lifecycle event name: '+name);
    }

    return this.events.fetch(name);
  }
}