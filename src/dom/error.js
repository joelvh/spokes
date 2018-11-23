const listener = (('console' in window) && ('error' in window)) ? window.console.error : (() => null);

export default listener;