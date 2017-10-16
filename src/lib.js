import assert from 'assert';

function bufferSplit(bufs, divider){
  assert(bufs.length % divider === 0);
  const quotient = bufs.length / divider;
  return range(divider).map(i => bufs.slice(quotient * i, quotient * (i+1)));
}

function range(start, end=start) {
  if (start === end) start = 0;
  const result = [];

  for (let i=start; i<end; i++) 
    result.push(i);

  return result;
}
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
  bufferSplit,
  isStream,
  log,
}
