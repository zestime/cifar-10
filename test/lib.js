import sinon from 'sinon';
import assert from 'assert';

import stream from 'stream';

import {isStream, bufferSplit} from '../src/lib';

describe('Lib', ()=> {
  describe('isStream', ()=> {
    it('should return true for only stream', () => {
      const sr = stream.Readable();

      assert(isStream(sr));
      assert(!isStream({}));
    });
  });

  describe('bufferSplit', () => {
    it('should return five Buffers', () => {
      const divider = 5;
      const str = "test_str";
      const bufs = Buffer.from(str.repeat(divider));
  
      const result = bufferSplit(bufs, divider);

      assert.equal(divider, result.length);

      assert(result.every(s => String(s) == str));

    });
  });
});
  
