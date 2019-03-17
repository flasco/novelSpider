const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.read);

class FileOperator {
  constructor(filePath) {
    this.fileName = filePath;
    this.file = fs.openSync(this.fileName, 'a+');
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
    fs.appendFileSync(this.file, content);
  }

  async readFile(position, length) {
    const fileContent = Buffer.alloc(length);
    const { bytesRead } = await readFile(this.file, fileContent, 0, length, position);
    return fileContent.slice(0, bytesRead);
  }

  close() {
    fs.closeSync(this.file);
  }
}

module.exports = FileOperator;