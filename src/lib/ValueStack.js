import List from './List'

/*
    Appends values rather than  overwriting
*/
export default class ValueStack extends List {
  add (key, value) {
    const index = this.keys.indexOf(key)

    if (index !== -1) {
      this.keys.splice(index, 1)
      this.values.splice(index, 1)
    }

    return this.append(key, value)
  }

  append (key, value) {
    var index = this.keys.indexOf(key)

    if (index === -1) {
      this.keys.push(key)
      index = this.values.push([value]) - 1
    } else {
      this.values[index].push(value)
    }

    return this.values[index].slice()
  }
}
