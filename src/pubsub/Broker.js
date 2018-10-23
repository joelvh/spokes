import List from '../lib/List';
import Topic from './Topic';
import debug from '../dom/debug';
// import ValueStack from '../lib/ValueStack';

const GLOBAL_TOPIC = '*';
const DEFAULT_OPTIONS = Topic.defaultOptions;

export default class Broker {
  static get defaultOptions() {
    return DEFAULT_OPTIONS;
  }

  constructor({ keepHistory = DEFAULT_OPTIONS.keepHistory } = {}) {
    this.topics = new List();
    this.keepHistory = keepHistory;
    // this.history = new ValueStack();
    this.globalTopic = this.registerTopic(GLOBAL_TOPIC);
  }

  registerTopic(name, options) {
    debug('Broker.registerTopic('+name+')', options);

    if (this.topics.has(name)) {
      throw new Error('Topic already registered: '+name);
    }

    const topic = new Topic(name, options);
      
    if (name !== GLOBAL_TOPIC) {
      topic.subscribe(({ topic, event, data }, subscription) => {
        debug('topic',  topic, 'event', event, 'data', data)
        this.globalTopic.publish(`${topic}:${event}`, { topic, event, data })
      });
    }

    return this.topics.add(name, topic);
  }

  topic(topicName) {
    var topic;

    if (this.topics.has(topicName)) {
      topic = this.topics.fetch(topicName);
    } else {
      topic = this.registerTopic(topicName, { keepHistory: this.keepHistory });
    }

    return topic;
  }
}
