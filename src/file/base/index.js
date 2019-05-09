const fs = require('fs');
const path = require('path');
const util = require('util');
const readFile = util.promisify(fs.read);

class FileOperator {
  constructor(filePath) {
    this.fileName = filePath;
    this.isClose = false;
    this.createDir(this.fileName, () => {
      this.file = fs.openSync(this.fileName, 'a+');
    });
  }

  createDir(dir, cb) {
    const pathinfo = path.parse(dir);
    if (!fs.existsSync(pathinfo.dir)) {
      this.createDir(pathinfo.dir, function() {
        fs.mkdirSync(pathinfo.dir);
      });
    }
    cb && cb();
  }

  get fileSize() {
    return this.getFileInfo().size;
  }

  rename(newName) {
    fs.renameSync(this.fileName, newName);
  }

  getFileInfo() {
    return fs.fstatSync(this.file);
  }

  appendContent(content) {
    if (this.isClose) return;
    fs.appendFileSync(this.file, content);
  }

  async readFile(position, length) {
    const fileContent = Buffer.alloc(length);
    const { bytesRead } = await readFile(
      this.file,
      fileContent,
      0,
      length,
      position
    );
    return fileContent.slice(0, bytesRead);
  }

  close() {
    this.isClose = true;
    fs.closeSync(this.file);
  }
}

module.exports = FileOperator;
