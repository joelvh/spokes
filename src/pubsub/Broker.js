import List from '../lib/List'
import Topic from './Topic'
import { DEFAULT_OPTIONS } from './settings'

const GLOBAL_TOPIC = '*'

export default class Broker {
  constructor (options = {}) {
    this.settings = { ...DEFAULT_OPTIONS, ...options }

    this.topics = new List()
    this.globalTopic = this.registerTopic(GLOBAL_TOPIC)
  }

  registerTopic (name, options = {}) {
    if (this.topics.has(name)) {
      throw new Error('Topic already registered: ' + name)
    }

    const topic = new Topic(name, { ...this.settings, ...options })

    if (name !== GLOBAL_TOPIC) {
      topic.subscribe(({ key, value }, subscription) => {
        this.globalTopic.publish(`${subscription.topic.name}:${key}`, {
          topic: subscription.topic.name,
          key,
          value
        })
      })
    }

    return this.topics.add(name, topic)
  }

  topic (topicName) {
    return this.topics.fetch(topicName, () => (
      this.registerTopic(topicName, {
        keepHistory: this.settings.keepHistory
      })
    ))
  }
}
