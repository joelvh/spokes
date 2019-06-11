const { console = {} } = window || global

export default function error (...args) {
  if ('error' in console) {
    console.error(...args)
  }
}
