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
    const values = [...this.fetch(key, []), value]

    super.add(key, values)

    return copy(values)
  }

  remove (key) {
    return copy(super.remove(key))
  }

  fetch (key, fallback = null) {
    return copy(super.fetch(key, fallback))
  }
}
