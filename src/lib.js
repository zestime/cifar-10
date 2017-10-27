import assert from 'assert';

function bufferSplit(bufs, divider){
  assert(bufs.length % divider === 0);
  const quotient = bufs.length / divider;
  return range(divider).map(i => bufs.slice(quotient * i, quotient * (i+1)));
}

function flatten(arr) {
  return arr.reduce((acc, {X, y}) => {
    acc.X = acc.X.concat(X);
    acc.y = acc.y.concat(y);
    return acc;
  }, {
    X: [],
    y: []
  });
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


export {
  bufferSplit,
  isStream,
  range,
  flatten,
}
