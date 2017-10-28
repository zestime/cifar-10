import fs from 'fs';
import path from 'path';

import _ from 'lodash';

import { isStream, flatten } from './lib';
import cifar10 from './cifar-10';

export default  {
  createStream(filename, {totalSize}){
    return fs.createReadStream(filename, {highWaterMark:totalSize});
  },

  createPromise(stream, config) {
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
  },

  async combine(files, options) {
    const ps = files.map(name => this.createStream(name, options))
                    .map(sr => this.createPromise(sr, options));
    return await Promise.all(ps).then(values => flatten(values));
  },

  async load(options=cifar10) {
    try{
      const { X: X_train, y: y_train } = await this.combine(options.trainFiles, options);
      const { X: X_test, y: y_test } = await this.combine(options.testFiles, options);

      return {
        X_train,
        y_train,
        X_test,
        y_test
      }
    }
    catch(e) {
      if (e instanceof TypeError) { // wrong file name
        console.error(e, "Data files are not existed. Run 'get_datasets.sh'")
        throw new Error("missing data file"); 
      }
    }
  }
};
