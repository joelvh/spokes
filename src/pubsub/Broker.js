import List from '../lib/List'
import Topic from './Topic'
// import ValueStack from '../lib/ValueStack';

const GLOBAL_TOPIC = '*'
const DEFAULT_OPTIONS = Topic.defaultOptions

export default class Broker {
  static get defaultOptions () {
    return DEFAULT_OPTIONS
  }

  constructor ({ keepHistory = DEFAULT_OPTIONS.keepHistory } = {}) {
    this.topics = new List()
    this.keepHistory = keepHistory
    this.globalTopic = this.registerTopic(GLOBAL_TOPIC)
  }

  registerTopic (name, options) {
    if (this.topics.has(name)) {
      throw new Error('Topic already registered: ' + name)
    }

    const topic = new Topic(name, options)

    if (name !== GLOBAL_TOPIC) {
      topic.subscribe(({ key, value }, subscription) => {
        this.globalTopic.publish(`${subscription.topic.name}:${key}`, { topic: subscription.topic.name, key, value })
      })
    }

    return this.topics.add(name, topic)
  }

  topic (topicName) {
    var topic

    if (this.topics.has(topicName)) {
      topic = this.topics.fetch(topicName)
    } else {
      topic = this.registerTopic(topicName, { keepHistory: this.keepHistory })
    }

    return topic
  }
}
