export default class List {
  keys   = [];
  values = [];

  has(key) {
    return this.keys.indexOf(key) != -1;
  }

  pairs() {
    const values = this.values;
    return this.keys.map((key, index) => [key, values[index]]);
  }
  
  add(key, value) {
    const index = this.keys.indexOf(key);

    if (index != -1) {
      this.values[index] = value;
    } else {
      this.keys.push(key);
      this.values.push(value);
    }

    return value;
  }

  fetch(key) {
    const index = this.keys.indexOf(key);

    if (index != -1) {
      return this.values[index];
    } else {
      return [];
    }
  }

  serialize() {
    return this.pairs().reduce((hash, pair) => {
      hash[pair[0]] = pair[1];
      return hash;
    }, {});
  }
}