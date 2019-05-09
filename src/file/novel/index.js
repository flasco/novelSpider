const BaseFileOperator = require('../base');

const urlBuf = Buffer.from('"url":');
const imgBuf = Buffer.from(',"img":');

class NovelFileOperator extends BaseFileOperator {
  constructor(props) {
    super(props);

    this.startCheck();
    this.isFirstOpen = this.fileSize < 18;
  }
  async getLastPos(size, chunk = 200) {
    for (let i = size - chunk; i > 0; i = i > chunk ? i - chunk : 0) {
      const content = await this.readFile(i, chunk);
      for (let i = content.length; i > -1;) {
        // Buffer.from(',{'); // 2c 7b
        if (content[i] == 0x7b) {
          if (content[i - 1] === 0x2c) return i;
          i -= 2;
        } else i -= 1;
      }
    }
    return -1;
  }

  async getLastUrl() {
    const size = this.fileSize;
    const lastPos = await this.getLastPos(size);
    if (lastPos != -1) {
      const newBuf = await this.readFile(lastPos, size);

      const pos1 = newBuf.lastIndexOf(urlBuf);
      const pos2 = newBuf.lastIndexOf(imgBuf);
      const nnbuf = newBuf.slice(pos1 + 7, pos2 - 1);

      console.log(nnbuf.toString());

      return nnbuf.toString();
    } else {
      console.log('find failed');
    }
  }

  startCheck() {
    if (this.fileSize < 1) this.appendContent('{ "results": [');
  }

  async renameEnd() {
    if (this.isClose) return;
    const url = await this.getLastUrl();
    this.endAppend();

    const end = url.match(/_(\d+)\//)[1]; // 必定符合解析规则
    const newName = this.fileName.split('.');
    newName[0] += `-${end}`;
    this.rename(newName.join('.'));
  }

  endAppend() {
    this.appendContent(']}');
    this.close();
  }

  async isFinished() {
    const size = this.fileSize;
    const newBuf = await this.readFile(size - 1, 1);
    return newBuf[0] === 0x7d;
  }
}

module.exports = NovelFileOperator;
