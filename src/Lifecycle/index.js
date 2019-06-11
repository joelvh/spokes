import { Promise } from '../dom/window'
import List from '../lib/List'

export default class Lifecycle {
  constructor (name, topic, spokes) {
    this.name = name
    this.topic = topic
    this.spokes = spokes
    this.events = new List()
  }

  registerEvent (name, executor) {
    if (this.events.has(name)) {
      throw new Error('Lifecycle event already registered: ' + name)
    }

    const promise = new Promise((resolve, reject) => {
      executor((value) => {
        resolve(value)
        this.topic.publish(name, value)
      }, reject)
    })

    this.events.add(name, promise)

    return promise
  }

  when (name) {
    return this.events.fetch(name, () => { throw new Error('Unknown lifecycle event name: ' + name) })
  }
}
