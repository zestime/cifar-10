
function isStream(stream) {
  return stream !== null &&
    typeof stream === 'object' &&
    typeof stream.pipe === 'function';
}

function log(first, ...rest) {
  if (typeof first === 'function') {
    return (...args) => _log(first.apply(null, args), args);
  }
  return _log([first].concat(rest));
}

function _log(...rest) {
  console.log.apply(null, rest);
  return rest[0];
}

export {
  isStream,
  log
}


