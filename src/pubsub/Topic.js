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
      const [key, value] = this.history[this.history.length - 1];
      subscription.publish({ key, value });
    }

    return subscription;
  }

  publish(key, value) {
    debug(`Topic(${this.name}).publish`, key, value);
    // Clear history if we don't keep it
    if (!this.keepHistory) {
      this.history.length = 0;
    }

    // Store last event in case a subscriber uses `withLastEvent` option
    this.history.push([key, value]);
    // Make sure the published data is a copy
    this.subscriptions.forEach(subscription => subscription.publish({ key, value }));
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
