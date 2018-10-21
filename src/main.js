import Spokes from './Spokes';
import Broker from './Spokes/pubsub/Broker';
import document from './Spokes/dom/document';

window._spokes = new Spokes({
    document: document,
    broker: new Broker()
});