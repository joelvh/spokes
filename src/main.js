import window from './Spokes/dom/window';
import document from './Spokes/dom/document';
import Spokes from './Spokes/index';
import Page from './Spokes/lifecycle/Page';

const spokes = new Spokes();

spokes.register(new Page(document));

window._spokes = spokes;