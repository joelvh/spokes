import parseQueryString from '../../parseQueryString';

export default class Page {
  constructor(document) {
    this.document = document;
  }

  register(spokes) {
    const document = this.document;

    // Page load

    spokes.registerLifecycleEvent('Page:Loaded', (resolve, reject) => {
      const resolver = () => resolve(document);
    
      if (this.loaded()) {
        resolver();
      } else {
        document.addEventListener("DOMContentLoaded", resolver);
      }
    });

    // Query string parsing

    spokes.registerLifecycleEvent('Page:QueryStringParsed', (resolve, reject) => {
      spokes.lifecycle('Page:Loaded').then(document => resolve(parseQueryString(document.location.search))).catch(reject);
    });

    // Query string state storage

    spokes.lifecycle('Page:QueryStringParsed').then(qs => spokes.setState('QueryString', qs));
  }

  loaded() {
    return this.document.readyState === "complete" || (this.document.readyState !== "loading" && !this.document.documentElement.doScroll);
  }
}