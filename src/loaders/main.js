import Spokes from '..'
import Page from '../lifecycle/Page'

const { document } = window
const spokes = new Spokes()

spokes.registerLifecycle('Page', lifecycle => new Page(document).load(lifecycle))

window._spokes = spokes
