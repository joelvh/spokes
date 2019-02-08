export default class List {
  keys = [];
  values = [];

  index (key) {
    return this.keys.indexOf(key)
  }

  has (key) {
    return this.index(key) !== -1
  }

  pairs () {
    return this.keys.map((key, index) => [key, this.values[index]])
  }

  add (key, value) {
    const index = this.index(key)

    if (index !== -1) {
      this.values[index] = value
    } else {
      this.keys.push(key)
      this.values.push(value)
    }

    return value
  }

  remove (key) {
    const index = this.index(key)

    // remove the existing value history before appending
    if (index === -1) {
      return null
    }

    const value = this.fetch(key)

    this.keys.splice(index, 1)
    this.values.splice(index, 1)

    return value
  }

  fetch (key) {
    const index = this.index(key)

    if (index !== -1) {
      return this.values[index]
    } else {
      return null
    }
  }

  serialize () {
    return this.pairs().reduce((hash, pair) => {
      hash[pair[0]] = pair[1]
      return hash
    }, {})
  }
}
