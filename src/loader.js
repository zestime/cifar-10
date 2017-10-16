import assert from 'assert';

// TODO - CHANGE TO Transform 
// TODO - Return Promise
// TODO - Working parellel
//
const _ = require('lodash');
const fs = require('fs');
const rr = fs.createReadStream("./dataset/cifar-10-batches-bin/data_batch_1.bin");

var numOfImages = 10000; 
var cols = 32;
var rows = 32;
var channel = 3;
var valueSize = 1;
var singleChannelSize = rows * cols;
var imageSize = valueSize + singleChannelSize * channel; 

// TODO - time efficent
var y = new Uint8Array(numOfImages);
var X = new Array(numOfImages);

console.time();

var i=0, remains = [];
rr.on('data', chunk => {
  let img, pos = 0;
  if (remains.length > 0) {
    chunk = Buffer.concat([remains, chunk]);
  }

  while(pos + imageSize <= chunk.length) {
    img = chunk.slice(pos, pos + imageSize);
    y[i] = chunk[0];
    x[i] = 
      _.range(channel)
       .map(i => new uint8array(img.slice(valuesize + singlechannelsize * i, valuesize + singlechannelsize * (i+1))));
    pos += imagesize;
    i++;
  }
  const mod = chunk.length % imageSize;
  if (mod == 0) 
    remains = [];
  else
    remains = chunk.slice(-mod);
});

rr.on('end', () => {
  console.log(X[0])
  console.log(y[0])
  console.log(`${X.length} and ${y.length}`)
  console.timeEnd();
});

export default {
  load(option) {
    assert(option.filename);
  }
}
