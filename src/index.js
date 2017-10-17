import fs from 'fs';
import path from 'path';

import _ from 'lodash';

import { isStream, log } from './lib';
import cifar10 from './cifar-10';

const trainFileNames = [
  "data_batch_1.bin",
  "data_batch_2.bin",
  "data_batch_3.bin",
  "data_batch_4.bin",
  "data_batch_5.bin",
];

const testFileNames = [ "data_batch_test.bin" ];

export default  {
  createStream(filename, {totalSize}){
    return fs.createReadStream(filename, {highWaterMark:totalSize});
  },

  createPromise(stream, config) {
    let output = [];
    if (!isStream(stream)) return Promise.resolve([config.mapper(stream)]);

    return new Promise((resolve, reject) => {
      const converter = data => output.push(config.mapper(data));
      const resolver = () => {
        resolve(output);
        output = null;
        stream.removeListener('data', converter)
        stream.removeListener('end', resolver)
        stream.removeListener('close', resolver)
      }
      try {
        stream.on('data', converter);
        // stream.on('data', function() {
        //   console.log("data")
        // });
        stream.on('end', resolver); 
        stream.on('close', resolver); 
      }
      catch(e){
        reject(e);
      }
    });
  },

  mapper(chunk) {

  },

  async combine(files, options) {
    const ps = files.map(name => this.createStream(name, options))
                    .map(sr => this.createPromise(sr, options));
    return await Promise.all(ps).then(values => _.flatten(values));
  },

  load(opt={
        dir: path.join(__dirname, 'cifar-10-batches-bin'),
        getFileName : i => `${this.dir}/data_batch_${i}.bin`,
      }) {

    const trainFiles = _.range(1,6).map(i => opt.getFileName(i));
    const testFiles = opt.getFileName('test'); 

    opt = opt.mapper || this.mapper;

    const inputInfo = {
      cols : 32,
      rows : 32,
      channel : 3,
      valueSize : 1,
    };
    const singleChannelSize = option.rows * option.cols;
    const imageSize = option.valueSize + option.singleChannelSize * option.channel;

    const { X_train = X, y_train = y } = combine(trainFiles, opt);
    const { X_test = X, y_test = y } = combine(testFiles, opt);

    return {
      X_train,
      y_train,
      X_test,
      y_test
    }
  }
};

