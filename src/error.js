export default function error (...args) {
  if (typeof console !== 'undefined' && 'error' in console) {
    console.error(...args)
  }
}
