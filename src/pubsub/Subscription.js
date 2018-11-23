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

  publish(payload) {
    if (!this.unsubscribed) {
      try {
        this.handler(payload, this);
        return true;
      } catch(ex) {
        error(ex);
        return ex;
      }
    } else {
      return false;
    }
  }
}
