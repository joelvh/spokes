import parseQueryString from '../../parseQueryString';

export default class Page {
  constructor(document) {
    this.document = document;
  }

  load(lifecycle) {
    // Page load
    lifecycle.registerEvent('Loaded', (resolve, reject) => {
      const resolver = () => resolve(this.document);
    
      if (this.loaded()) {
        resolver();
      } else {
        this.document.addEventListener("DOMContentLoaded", resolver);
      }
    });

    // Query string parsing
    lifecycle.registerEvent('QueryStringParsed', (resolve, reject) => {
      lifecycle.when('Loaded').then(document => resolve(parseQueryString(document.location.search))).catch(reject);
    });

    // Query string state storage
    lifecycle.when('QueryStringParsed').then(qs => lifecycle.spokes.setState('QueryString', qs));
  }

  loaded() {
    return this.document.readyState === "complete" || (this.document.readyState !== "loading" && !this.document.documentElement.doScroll);
  }
}