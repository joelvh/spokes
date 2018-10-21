import Subscription from './Subscription';

export default class Topic {
  constructor(name) {
    this.name = name;
    this.history = [];
  }

  subscriptions = [];

  subscribe(handler, options = {}) {
    console.log(`Topic(${this.name}) => subscribe(handler)`, 'handler()');
    const subscription = new Subscription(this, handler);
    this.subscriptions.push(subscription);

    if (options.withLastEvent && this.history.length)  {
      subscription.publish(...this.history[this.history.length - 1]);
    }

    return subscription;
  }

  publish(...payload) {
    console.log(`Topic(${this.name}) => publish(payload)`, ...payload);
    this.history.push(payload);
    this.subscriptions.forEach(subscription => subscription.publish(...payload));
  }

  unsubscribe(subscription) {
    console.log(`Topic(${this.name}) => unsubscribe(subscription)`, subscription);
    const index = this.subscriptions.indexOf(subscription);

    if (index != -1) {
      this.subscriptions.splice(index, 1);
      return true;
    } else {
      return false;
    }
  }
}
