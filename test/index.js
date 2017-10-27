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
  const sandbox = sinon.createSandbox();


  describe('Main with Stub', () => {
    let createStream;
    beforeEach( () => {
      createStream = sandbox.stub(cifar10, 'createStream'); 
    });

    afterEach( () => {
      sandbox.restore();
    });
    it('should set highWaterMark at createStream', () => {
      const option = {highWaterMark, mapper:_.identity};

      return cifar10.combine([null], option).catch(() => {
        assert(createStream.called);
        sinon.assert.calledWith(cifar10.createStream, null, option);
      });
    });

    it('should combine all promises using stream', () => {
      const sr = new stream.Readable();
      sr._read = function() {}
      createStream.returns(sr);

      const result = cifar10.combine([1], { 
        mapper: str => ({X: String(str), y: String(str)})
      });
      sr.emit('data', filename);
      sr.emit('end');

      const expect = {
        X: [filename],
        y: [filename]
      }

      return result.then((result) => {
        assert.deepEqual( expect, result);
      }).catch((error) => {
        assert.isNotOk(error,'Promise error');
      });
    });

    it('should error when streams combine ', () => {
      const sr = new stream.Readable();
      sr._read = function() {}
      createStream.returns(sr);

      const result = cifar10.combine([1], { 
        mapper: str => ({X: String(str), y: String(str)})
      });
      sr.emit('data', {X:[]});
      sr.emit('end');

      return result.catch((error) => {
        console.log(error);
        assert(error);
      });
    });
  });

  describe('with actual files', () => {
    it('should return CIFAR10 from  a test file', async () => {
      const config = Object.assign({}, cifar10_config, {
        dir: __dirname
      });
      
      const {X, y} = await cifar10.combine([config.getFileName('tc')], config);

      assert.equal(10, X.length);
      assert.equal(10, y.length);
      assert.equal(config.channel, X[0].length);
    });

    it('should load CIFAR10 test', async () => {
      const file = __dirname + '/data_batch_tc.bin';
      const con = {
        trainFiles: [file, file],
        testFiles: [file]
      }
      const config = Object.assign({}, cifar10_config, con); 

      const { X_train, y_train, X_test, y_test } = await cifar10.load(config);

      assert(X_train);
      assert(y_train);
      assert(X_test);
      assert(y_test);
      assert.equal(20, X_train.length);
      assert.equal(10, X_test.length);
    });

 });
});

