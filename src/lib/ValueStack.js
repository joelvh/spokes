import List from './List'

function copy (array) {
  return array ? array.slice() : []
}

/*
    Appends values rather than  overwriting
*/
export default class ValueStack extends List {
  pairs () {
    return super.pairs().map(([key, value]) => [key, copy(value)])
  }

  add (key, value) {
    let values

    if (this.has(key)) {
      values = this.fetch(key)
      values.push(value)
    } else {
      values = super.add(key, [value])
    }

    return copy(values)
  }

  remove (key) {
    return copy(super.remove(key))
  }

  fetch (key) {
    return copy(super.fetch(key))
  }
}
