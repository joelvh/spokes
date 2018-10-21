import Subscription from './Subscription';
import log from '../dom/log';

const DEFAULT_OPTIONS = {
  keepHistory: false,
  withLastEvent: false
};

export default class Topic {
  static get defaultOptions() {
    return DEFAULT_OPTIONS;
  }

  constructor(name, { keepHistory = DEFAULT_OPTIONS.keepHistory } = {}) {
    this.name = name;
    this.keepHistory = keepHistory;
    this.history = [];
  }

  subscriptions = [];

  subscribe(handler, { withLastEvent = DEFAULT_OPTIONS.withLastEvent } = {}) {
    log(`Topic(${this.name}) => subscribe(handler)`, 'handler()');
    const subscription = new Subscription(this, handler);
    this.subscriptions.push(subscription);

    if (withLastEvent && this.history.length)  {
      subscription.publish(...this.history[this.history.length - 1]);
    }

    return subscription;
  }

  publish(...payload) {
    log(`Topic(${this.name}) => publish(payload)`, ...payload);
    // Clear history if we don't keep it
    if (!this.keepHistory) {
      this.history.length = 0;
    }
    // Store last event in case a subscriber uses `withLastEvent` option
    this.history.push(payload);
    this.subscriptions.forEach(subscription => subscription.publish(...payload));
  }

  unsubscribe(subscription) {
    log(`Topic(${this.name}) => unsubscribe(subscription)`, subscription);
    const index = this.subscriptions.indexOf(subscription);

    if (index != -1) {
      this.subscriptions.splice(index, 1);
      return true;
    } else {
      return false;
    }
  }
}
