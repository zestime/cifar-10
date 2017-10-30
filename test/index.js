import sinon from 'sinon';
import { expect } from 'chai';
import fs from 'fs';

import stream from 'stream';
import path from 'path';

import * as cifar10 from '../src';
const bufferSplit = cifar10.bufferSplit;
const isStream = cifar10.isStream;
const cifar10_config = cifar10.cifar10;


describe('CIFAR 10 Library', () => {
  const filename = __dirname +  "/data_batch_tc.bin";
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
      const option = {highWaterMark, mapper:x => x};

      return cifar10.combine([filename], option).catch(() => {
        console.log('called', createStream.called);
        sinon.assert.called(createStream);
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

      return result.then((data) => expect(data).to.deep.equal({
          X: [filename],
          y: [filename]
        })
      ).catch((error) => {
        expect(error).to.be.an('error');
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
        expect(error).to.be.an('error');
      });
    });
  });

  describe('with actual files', () => {
    it('should error when filename is null', () => {
      const con = {
        trainFiles: [null]
      }
      const config = Object.assign({}, cifar10_config, con); 

      return cifar10.load(config).catch(e => {
        expect(e).to.be.an('error');
      });
    });

    it('should error when file is not existed', () => {
      const con = {
        trainFiles: [filename + '!!']
      }
      const config = Object.assign({}, cifar10_config, con); 

      return cifar10.load(config).catch(e => {
        expect(() => {throw e}).throw(Error, /get_datasets\.sh/);
      });
    });

    it('should return CIFAR10 from  a test file', async () => {
      const config = Object.assign({}, cifar10_config, {
        dir: __dirname
      });
      
      const {X, y} = await cifar10.combine([config.getFileName('tc')], config);
      expect(X.length).to.equal(10);
      expect(y.length).to.equal(10);
      expect(X[0].length).to.equal(config.channel);
    });

    it('should load CIFAR10 test', async () => {
      const file = __dirname + '/data_batch_tc.bin';
      const con = {
        trainFiles: [file, file],
        testFiles: [file]
      }
      const config = Object.assign({}, cifar10_config, con); 

      const { X_train, y_train, X_test, y_test } = await cifar10.load(config);

      expect(X_train).to.exist;
      expect(y_train).to.exist;
      expect(X_test).to.exist;
      expect(y_test).to.exist;
      expect(X_train.length).to.equal(20);
      expect(X_test.length).to.equal(10);
    });

 });
});

describe('Lib', ()=> {
  describe('isStream', ()=> {
    it('should return true for only stream', () => {
      const sr = stream.Readable();

      expect(isStream(sr)).to.be.ok;
      expect(isStream({})).to.not.be.ok;
    });
  });

  describe('bufferSplit', () => {
    it('should return five Buffers', () => {
      const divider = 5;
      const str = "test_str";
      const bufs = Buffer.from(str.repeat(divider));
  
      const result = bufferSplit(bufs, divider);

      expect(result.length).to.equal(divider);
      expect(result.every(s => String(s) == str)).to.be.ok;
    });
  });
});
  
