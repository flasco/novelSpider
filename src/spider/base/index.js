const Queue = require('../../third-party/queue');
const iconv = require('iconv-lite');

const FileOperator = require('../../file/novel');
const { sleep, crawlPage } = require('../../util');

class BaseSpider {
  constructor(filePath) {
    this.conNum = 5;
    this.failCnt = 0;
    this.needCheck = false;
    this.log = this.log.bind(this);
    this.stop = this.stop.bind(this);

    this.queue = new Queue(5);
    this.queue.drain = this.queueDrain.bind(this);
    this.queue.work = this.queueLooper.bind(this);

    this.file = new FileOperator(filePath);
  }

  async queueLooper(url) {
    const novel = await this.fetchNovel(url);
    if (novel == null) {
      this.failCnt++;
      this.log('Jump! failCnt:', this.failCnt);
    } else {
      this.failCnt > 0 && (this.failCnt = 0);
      this.log(novel.name, novel.url);
      this.file.appendContent(JSON.stringify(novel) + ',');
    }
    if (this.failCnt > 250) {
      this.log('已经到达边界，break...');
      this.stop();
    }
    await sleep(1200);
  }

  log(...args) {
    console.log(`[info]${this.site} |`, ...args);
  }

  async queueDrain() {
    this.log('finish...');
    await this.file.renameEnd();
  }

  async fetchPage(url) {
    let { err, data } = await crawlPage(url);
    if (!err && data !== '') {
      return iconv.decode(data, this.charset);
    }
    return '';
  }

  async stop() {
    this.log('need end...');
    await this.file.renameEnd();
    this.queue.kill();
  }

  formatNovel({
    name,
    author,
    url,
    img,
    desc,
    plantFormId = this.plantFormId || -1
  }) {
    return { name, author, url, img, desc, plantFormId };
  }
}

module.exports = BaseSpider;
