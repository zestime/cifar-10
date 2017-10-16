import { bufferSplit as split, zip } from './lib';

export default {
  cols: 32,
  rows: 32,
  channel: 3,
  valueSize: 1,
  get totalSize() {
    return this.channel * this.cols * this.rows;
  },
  mapper: (chunk) => {
    const y = chunk[0];
    return split(chucnk.slice(this.valueSize), this.channel);
  }
}

