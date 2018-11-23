import Subscription from './Subscription';

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
    const subscription = new Subscription(this, handler);
    this.subscriptions.push(subscription);

    if (withLastEvent && this.history.length)  {
      const [key, value] = this.history[this.history.length - 1];
      subscription.publish({ key, value });
    }

    return subscription;
  }

  publish(key, value) {
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
    const index = this.subscriptions.indexOf(subscription);

    if (index != -1) {
      this.subscriptions.splice(index, 1);
      return true;
    } else {
      return false;
    }
  }
}
