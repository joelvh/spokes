export default class PageLoad {
  constructor(document) {
    this.document = document;
  }

  executor = (resolve, reject) => {
    const resolver = () => resolve(this.document);

    if (this.loaded()) {
      resolver();
    } else {
      this.document.addEventListener("DOMContentLoaded", resolver);
    }
  };

  loaded() {
    return this.document.readyState === "complete" || (this.document.readyState !== "loading" && !this.document.documentElement.doScroll);
  }
}