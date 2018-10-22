import window from '../dom/window';
import document from '../dom/document';
import Spokes from '..';
import Page from '../lifecycle/Page';
import User from '../lifecycle/User';
import Analytics from '../lifecycle/Analytics';

const spokes = new Spokes();

spokes.register(new Page(document));
spokes.register(new User());
spokes.register(new Analytics(window));

window._spokes = spokes;