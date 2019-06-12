import List from './lib/List'
import ValueStack from './lib/ValueStack'
import Broker from './pubsub/Broker'
import Lifecycle from './Lifecycle'
import { DEFAULT_OPTIONS } from './pubsub/settings'

const STATE_TOPIC = 'StateChanges'

export default class Spokes {
  constructor (options = {}) {
    this.settings = { ...DEFAULT_OPTIONS, ...options }
    this.broker = new Broker(options)
    this.lifecycles = new List()
    this.stateStack = new ValueStack()

    this.stateTopic = this.broker.registerTopic(STATE_TOPIC)
  }

  // Lifecycle event resolving

  registerLifecycle (name, startLifecycle) {
    if (this.lifecycles.has(name)) {
      throw new Error('Lifecycle already registered: ' + name)
    }

    const topic = this.broker.registerTopic(name)
    const lifecycle = new Lifecycle(name, topic, this)

    startLifecycle(lifecycle)

    this.lifecycles.add(name, lifecycle)

    return this
  }

  when (lifecycleName, eventName) {
    return this.lifecycles.fetch(lifecycleName).when(eventName)
  }

  // State

  setState (key, value) {
    // only update state if the value changed
    if (this.isChanged(key, value)) {
      this.stateStack.add(key, value)
      this.stateTopic.publish(key, value)
    }
  }

  getState (key) {
    const value = this.stateStack.fetch(key)
    return value.length > 0 ? value.pop() : null
  }

  // Pub/Sub

  subscribe (topic, handler, options) {
    return this.broker.topic(topic).subscribe(handler, options)
  }

  subscribeAll (handler, options) {
    return this.broker.globalTopic.subscribe(handler, options)
  }

  publish (topic, key, value) {
    return this.broker.topic(topic).publish(key, value)
  }

  isChanged (key, value) {
    return this.settings.comparer(this.getState(key), value)
  }

  debug (...messages) {
    if (this.settings.debug && typeof console !== 'undefined') {
      console.log('[DEBUG]', ...messages)
    }
  }
}
