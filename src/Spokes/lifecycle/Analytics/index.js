import DataLayer from './DataLayer';

export default class Analytics {
  constructor(window) {
    this.window = window;
    this.dataLayer = new DataLayer(window);
  }

  register(spokes) {
    spokes.registerLifecycleEvent('Analytics:Loaded', (resolve, reject) => {
      // TODO
    });
  }
}