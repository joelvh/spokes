import List from '../lib/List';
import Topic from './Topic';
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
  }

  topic(topicName) {
    var topic;

    if (this.topics.has(topicName)) {
      topic = this.topics.fetch(topicName);
    } else {
      topic = this.topics.add(topicName, new Topic(topicName, { keepHistory: this.keepHistory }));
      
      if (topicName !== GLOBAL_TOPIC) {
        topic.subscribe((...args) => {
          // remove subscription, which is passed to unsubscribe
          const subscription = args.pop();
          return this.publish(GLOBAL_TOPIC, topicName, ...args);
        });
      }
    }

    return topic;
  }

  subscribe(topicName, handler, ...args) {
    return this.topic(topicName).subscribe(handler, ...args);
  }

  subscribeAll(handler, ...args) {
    return this.topic(GLOBAL_TOPIC).subscribe(handler, ...args);
  }

  publish(topicName, ...payload) {
    // this.history.append(topicName, payload);
    return this.topic(topicName).publish(...payload);
  }
}
