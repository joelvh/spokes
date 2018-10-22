import window from './window';

var console;

if ('console' in window) {
  console = window.console;
} else {
  console = {
    log() {},
    error() {},
    debug() {}
  };
}

export default console;