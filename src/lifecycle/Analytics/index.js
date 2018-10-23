import DataLayer from './DataLayer';

export default class Analytics {
  constructor(window) {
    this.window = window;
    this.dataLayer = new DataLayer(window);
  }

  load(lifecycle) {
    lifecycle.registerEvent('Loaded', (resolve, reject) => {
      // TODO
    });
  }
}