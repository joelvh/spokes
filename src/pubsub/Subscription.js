import error from '../error'

export default class Subscription {
  unsubscribed = false

  constructor (topic, handler) {
    this.topic = topic
    this.handler = handler
  }

  unsubscribe () {
    this.unsubscribed = true
    return this.topic.unsubscribe(this)
  }

  publish (payload) {
    if (this.unsubscribed) {
      return false
    }

    try {
      this.handler(payload, this)
      return true
    } catch (ex) {
      error(ex)
      return ex
    }
  }
}
