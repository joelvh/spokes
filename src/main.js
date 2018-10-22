import window from './Spokes/dom/window';
import document from './Spokes/dom/document';
import Spokes from './Spokes';
import Page from './Spokes/lifecycle/Page';
import User from './Spokes/lifecycle/User';
import Analytics from './Spokes/lifecycle/Analytics';

const spokes = new Spokes();

spokes.register(new Page(document));
spokes.register(new User());
spokes.register(new Analytics());

window._spokes = spokes;