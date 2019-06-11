import ValueStack from './lib/ValueStack'
import { decodeURIComponent } from './dom/window'

// See: https://gist.github.com/cougrimes/491c9cbe3d397f8ccc94
export default function parseQueryString (querystring) {
  const result = new ValueStack()

  querystring.replace(/^\?*/, '')
    .replace(/(?:([^=&]+)(?:=([^&]*))?)/g, function (substring, key, value, index, string) {
      result.add(decode(key), decode(value))
    })

  return result
}

function decode (value) {
  if (value === undefined) {
    return null
  } else {
    return decodeURIComponent(value.replace(/\+/g, ' '))
  }
}
