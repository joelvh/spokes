import debug from '../dom/debug';
import error from '../dom/error';

export default class Subscription {
  constructor(topic, handler) {
    this.topic = topic;
    this.handler = handler;
  }

  unsubscribed = false;

  unsubscribe() {
    this.unsubscribed = true;
    return this.topic.unsubscribe(this);
  }

  publish(...payload) {
    if (!this.unsubscribed) {
      debug('Subscription('+this.topic.name+')', 'publish', ...payload);
      try {
        this.handler(...payload, this);
        return true;
      } catch(ex) {
        error(ex);
        return ex;
      }
    } else {
      debug('Subscription('+this.topic.name+')', 'publish(unsubscribed)', ...payload);
      return false;
    }
  }
}
