import fs from 'fs';
import path from 'path';
import assert from 'assert';

/* Library */
export function bufferSplit(bufs, divider){
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

export function isStream(stream) {
  return stream !== null &&
    typeof stream === 'object' &&
    typeof stream.pipe === 'function';
}

/* Configuration CIFAR-10 */
export const cifar10 = {
  dir: path.join(__dirname, 'cifar-10-batches-bin'),
  getFileName : function(postfix) {
    return `${this.dir}/data_batch_${postfix}.bin`;
  },
  get trainFiles() {
    return range(1,6).map(i => this.getFileName(i));
  },
  get testFiles(){
    return [`${this.dir}/test_batch.bin`];
  }, 
  cols: 32,
  rows: 32,
  channel: 3,
  valueSize: 1,
  get totalSize() {
    return this.valueSize + this.channel * this.cols * this.rows;
  },
  mapper: function (chunk) {
    const y = chunk[0];
    const X = bufferSplit(chunk.slice(this.valueSize), this.channel)
              .map(buf => new Uint8Array(buf));
    return { X, y };
  }
}


/* Main  */
export function createStream(filename, {totalSize}){
  const stream = fs.createReadStream(filename, {highWaterMark:totalSize});

  stream.on('error', (err) => {
    if (err.code === 'ENOENT')
      console.error(`Data files are not existed. Run '${__dirname}/get_datasets.sh'`)
      throw err;
  });

  return stream;
}

export function createPromise(stream, config) {
  let output = [];
  if (!isStream(stream)) {
    return Promise.resolve(config.mapper(stream));
  }

  return new Promise((resolve, reject) => {
    function converter(data) {
      output.push(config.mapper(data));
    }

    function resolver() {
      const ret = output.reduce((acc, {X, y}) => {
        acc.X.push(X);
        acc.y.push(y);
        return acc;
      }, {
        X: [],
        y: []
      });
      resolve(ret);
      output = null;
      removeListeners();
    }

    function removeListeners() {
      stream.removeListener('data', converter)
      stream.removeListener('end', resolver)
      stream.removeListener('close', resolver)
    }

    try {
      stream.on('data', converter);        // stream.on('data', function(data) {
      stream.on('end', resolver); 
      stream.on('close', resolver); 
    }
    catch(e) /*istanbul ignore next*/ {
      removeListeners();
      reject(e);
    }
  });
}

export async function combine(files, options) {
  const ps = files.map(name => createStream(name, options))
                  .map(sr => createPromise(sr, options));
  return await Promise.all(ps).then(values => flatten(values));
}

export async function load(options=cifar10) {
  try{
    const { X: X_train, y: y_train } = await combine(options.trainFiles, options);
    const { X: X_test, y: y_test } = await combine(options.testFiles, options);

    return {
      X_train,
      y_train,
      X_test,
      y_test
    }
  }
  catch(err) {
    if (err.code === 'ENOENT')
    console.log(`Data files are not existed. Run '${__dirname}/get_datasets.sh'`)
    throw err;
  }
}

export default {
  createStream,
  createPromise,
  combine,
  load,
}
