import Spider from './spider';
import iconv from 'iconv-lite';
import { crawlPage } from '../utils';

class XslaSpider extends Spider {
  constructor() {
    super('xsla', 'https://www.xs.la', 'utf-8', 1);
  }

  fetch = async (url) => {
    let { err, data } = await crawlPage(url);

    if (!err && data != '') {
      data = iconv.decode(data, this.decode);
      let needJmp = /location.href=\'(.*)\';/g.exec(data);
      if (needJmp !== null) {
        await fetch(needJmp[1]);
      } else {
        let novel = this.getNovel(data);
        novel != null && console.log(`[info]xs.la | ${novel.name} ${novel.url}`);
      }
    } else {
      console.log('[info]biqu.cm | Jump!   1');
    }
  }
}

export default XslaSpider;