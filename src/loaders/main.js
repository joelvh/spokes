import window from '../dom/window';
import document from '../dom/document';
import Spokes from '..';
import Page from '../lifecycle/Page';
import User from '../lifecycle/User';
import Analytics from '../lifecycle/Analytics';

const spokes = new Spokes();

spokes.registerLifecycle('Page', lifecycle => new Page(document).load(lifecycle));

window._spokes = spokes;