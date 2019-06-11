import { console } from './window'

export default ('error' in console) ? console.error : () => null
