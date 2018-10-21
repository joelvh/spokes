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
      console.log('Subscription('+this.topic.name+') => publish', ...payload);
      try {
        this.handler(...payload, this);
        return true;
      } catch(ex) {
        console.error(ex);
        return ex;
      }
    } else {
      console.log('Subscription('+this.topic.name+') => publish (unsubscribed)', ...payload);
      return false;
    }
  }
}
