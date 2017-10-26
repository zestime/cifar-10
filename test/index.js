import sinon from 'sinon';
import assert from 'assert';
import _ from 'lodash';
import fs from 'fs';

import stream from 'stream';
import path from 'path';

import cifar10 from '../src';
import cifar10_config from '../src/cifar-10';
import {isStream} from '../src/lib';

describe('CIFAR 10 Library', () => {
  const filename = "TEST.CSV";
  const highWaterMark = 61;

  describe('Main', () => {
    it('should set highWaterMark at createStream', () => {
      const option = {highWaterMark, mapper:_.identity};
      sinon.stub(cifar10, 'createStream');

      cifar10.combine([filename], option);

      assert(cifar10.createStream.called);
      sinon.assert.calledWith(cifar10.createStream, filename, option);
      cifar10.createStream.restore();
    });

    it('should combine all promises using string', async () => {
      sinon.stub(cifar10, 'createStream').returns(filename);
      
      const result = await cifar10.combine([1], {mapper: str => str.toLowerCase()});

      assert.deepEqual([filename.toLowerCase()], result);
      cifar10.createStream.restore();
    });

    it('should combine all promises using stream', () => {
      const sr = new stream.Readable();
      sr._read = function() {}
      var mock = sinon.stub(fs, 'createReadStream').returns(sr);

      const result = cifar10.combine([1], { mapper: str => String(str)});

      sr.emit('data', filename);
      sr.emit('end');
      mock.restore();
      return result.then((result) => {
        assert.deepEqual( [ filename ], result);
      });
    });

    it('should return CIFAR10 from test file', async () => {
      const config = Object.assign({}, cifar10_config, {
        dir: __dirname
      });
      
      const result = await cifar10.combine([config.getFileName('tc')], config);
      assert.equal(10, result.length);
      assert.equal(config.channel, result[0].length);
    });
 });
});

