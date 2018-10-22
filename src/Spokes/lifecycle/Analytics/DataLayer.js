export default class DataLayer {
  constructor(window) {
    this.window = window;
  }

  get queue() {
    if (!this.window.dataLayer) {
      this.window.dataLayer = [];
    }
    
    return this.window.dataLayer;
  }
}