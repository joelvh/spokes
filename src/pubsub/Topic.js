import Subscription from './Subscription';
import debug from '../dom/debug';

const DEFAULT_OPTIONS = {
  keepHistory: false,
  withLastEvent: false
};

export default class Topic {
  static get defaultOptions() {
    return DEFAULT_OPTIONS;
  }

  constructor(name, { keepHistory } = DEFAULT_OPTIONS) {
    this.name = name;
    this.keepHistory = keepHistory;
    this.history = [];
  }

  subscriptions = [];

  subscribe(handler, { withLastEvent = DEFAULT_OPTIONS.withLastEvent } = {}) {
    debug(`Topic(${this.name}).subscribe`);
    const subscription = new Subscription(this, handler);
    this.subscriptions.push(subscription);

    if (withLastEvent && this.history.length)  {
      const [event, data] = this.history[this.history.length - 1];
      subscription.publish({ topic: this.name, event, data });
    }

    return subscription;
  }

  publish(event, data) {
    debug(`Topic(${this.name}).publish`, event, data);
    // Clear history if we don't keep it
    if (!this.keepHistory) {
      this.history.length = 0;
    }

    // Store last event in case a subscriber uses `withLastEvent` option
    this.history.push([event, data]);
    // Make sure the published data is a copy
    this.subscriptions.forEach(subscription => subscription.publish({ topic: this.name, event, data }));
  }

  unsubscribe(subscription) {
    debug(`Topic(${this.name}).unsubscribe`);
    const index = this.subscriptions.indexOf(subscription);

    if (index != -1) {
      this.subscriptions.splice(index, 1);
      return true;
    } else {
      return false;
    }
  }
}
