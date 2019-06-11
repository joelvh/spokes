import Subscription from './Subscription'
import { DEFAULT_OPTIONS } from './settings'

export default class Topic {
  constructor (name, options = {}) {
    this.settings = { ...DEFAULT_OPTIONS, ...options }

    this.name = name
    this.history = []
  }

  subscriptions = [];

  subscribe (handler, { withLastEvent } = this.settings) {
    const subscription = new Subscription(this, handler)
    this.subscriptions.push(subscription)

    if (withLastEvent && this.history.length) {
      const [key, value] = this.history[this.history.length - 1]
      subscription.publish({ key, value })
    }

    return subscription
  }

  publish (key, value) {
    // Clear history if we don't keep it
    if (!this.settings.keepHistory) {
      this.history.length = 0
    }

    // Store last event in case a subscriber uses `withLastEvent` option
    this.history.push([key, value])
    // Make sure the published data is a copy
    return this.subscriptions.map(subscription => (
      subscription.publish({ key, value })
    ))
  }

  unsubscribe (subscription) {
    const index = this.subscriptions.indexOf(subscription)

    if (index !== -1) {
      this.subscriptions.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  lastValueFor (key) {
    for (let i = this.history.length - 1; i >= 0; i--) {
      if (this.history[i][0] === key) {
        return this.history[i][1]
      }
    }
  }

  isChanged (key, value) {
    return this.settings.comparer(this.lastValueFor(key), value)
  }
}
