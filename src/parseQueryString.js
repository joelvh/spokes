import ValueStack from './lib/ValueStack'

const { unescape } = window

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
    // Use `unescape` rather than `decodeURIComponent` because
    // the latter will cause a "URI malformed" error when
    // something like "60% off" is not URL-encoded properly
    return unescape(value.replace(/\+/g, ' '))
  }
}
