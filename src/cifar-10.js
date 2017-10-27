import path from 'path';
import { bufferSplit as split, zip, range } from './lib';

export default {
  dir: path.join(__dirname, 'cifar-10-batches-bin'),
  getFileName : function(postfix) {
    return `${this.dir}/data_batch_${postfix}.bin`;
  },
  get trainFiles() {
    return range(1,6).map(i => this.getFileName(i));
  },
  get testFiles(){
    return this.getFileName('test');
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
    const X = split(chunk.slice(this.valueSize), this.channel)
              .map(buf => new Uint8Array(buf));
    return { X, y };
  }
}

