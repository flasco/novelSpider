const path = require('path');
const cheerio = require('cheerio');
const BaseSpider = require('../base');

const { isDocker } = require('../../util');

class BooktxtSpider extends BaseSpider {
  constructor(start, end) {
    const fileName = `booktxt-${start}.json`;
    const fileDir = isDocker
      ? '/data/booktxt'
      : path.resolve(__dirname, '../../../fetched/booktxt');
    const filePath = path.resolve(fileDir, fileName);

    super(filePath);

    this.site = 'www.booktxt.net';
    this.charset = 'gbk';
    this.plantFormId = 3;

    this.start = start;
    this.end = end;
  }

  async work() {
    if (await this.file.isFinished()) {
      this.log('已经完成的文件, break');
      this.file.close();
      return;
    }
    if (!this.file.isFirstOpen) {
      const url = await this.file.getLastUrl();
      const start = +url.match(/_(\d+)\//)[1]; // 必定符合解析规则
      this.start = start + 1;
    }

    const s = (this.start / 1000) >>> 0;
    const e = (this.end / 1000) >>> 0;
    const sl = this.start % 1000;
    const el = this.end % 1000;
    for (let i = s; i <= e; i++) {
      const sx = 1000 * i + (i === s ? sl : 0);

      const next = 1000 * (i + 1);
      const ex = next > this.end ? this.end : next + (i === e ? el : 0);

      for (let j = sx, top = ex; j < top; j++) {
        this.queue.push(`https://www.booktxt.net/${i}_${j}/`);
      }
    }
  }

  async fetchNovel(url) {
    if (this.needCheck && this.failCnt > 100) this.stop();
    const data = await this.fetchPage(url);

    if (data === '') return;
    return this.getNovel(data);
  }

  getNovel(data) {
    const $ = cheerio.load(data, { decodeEntities: false });
    const tempVal = $(`meta[property='og:novel:read_url']`);
    if (tempVal.length === 0) return null;

    return this.formatNovel({
      url: tempVal[0].attribs.content,
      name: $("meta[property='og:novel:book_name']")[0].attribs.content,
      author: $("meta[property='og:novel:author']")[0].attribs.content,
      img: $("meta[property='og:image']")[0].attribs.content,
      desc: $("meta[property='og:description']")[0].attribs.content.replace(
        /<br\/>/g,
        '\n'
      )
    });
  }
}

module.exports = BooktxtSpider;
