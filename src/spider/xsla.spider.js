const iconv = require('iconv-lite');
const cheerio = require('cheerio');
const queue = require('async/queue');
const path = require('path');
const { appendContent, sleep, crawlPage, isDocker } = require('../util');

let fileName;

let failCnt = 0;

let checkFlag = false;

const XsQueue = queue(async (url, callback) => {
  await fetchList(url);
  await sleep(1200);
  callback();
}, 5); //线程数太多会抓取失败的

XsQueue.drain = () => {
  console.log('[info]xs.la | finish...');
  appendContent(fileName, ']}');
};

function start(start = 0, end = 40, checkFail = false) {
  fileName = isDocker
    ? path.resolve('/data/xs', `xs-${start}-${end}.json`)
    : path.resolve(__dirname, `../../fetched/xs/xs-${start}-${end}.json`);
  appendContent(fileName, '{ "results": [', );

  checkFlag = checkFail;

  for (let i = start; i <= end; i++) {
    for (let j = 1000 * i, top = 1000 * (i + 1); j < top; j++) {
      XsQueue.push(`https://www.xs.la/${i}_${j}/`);
    }
  }
}

async function fetchList(url) {
  if (checkFlag && failCnt > 100) {
    console.log('need end.');
    XsQueue.kill();
    appendContent(fileName, ']}');
  }
  let { err, data } = await crawlPage(url);
  if (!err) {
    if (data == "") {
      failCnt++;
      console.log(`[info]xs.la | Jump! failCnt: ${failCnt}`);
      return;
    }
    data = iconv.decode(data, 'utf-8');
    let needJmp = /location.href=\'(.*)\';/g.exec(data);
    if (needJmp !== null) {
      fetchList(needJmp[1]).catch((err) => console.log(err))
      return;
    }

    let $ = cheerio.load(data, { decodeEntities: false });

    let tempVal = $(`meta[property='og:novel:read_url']`);
    if (tempVal.length === 0) {
      console.log('[info]xs.la | Error,jmp');
      return;
    }
    let novel = {
      name: $(`meta[property='og:novel:book_name']`)[0].attribs.content,
      author: $(`meta[property='og:novel:author']`)[0].attribs.content,
      url: tempVal[0].attribs.content,
      img: $(`meta[property='og:image']`)[0].attribs.content,
      desc: $(`meta[property='og:description']`)[0].attribs.content.replace(/<br\/>/g, '\n'),
      plantFormId: 1,
    };

    console.log(`[info]xs.la | ${novel.name} ${novel.url}`);
    failCnt = 0;
    appendContent(fileName, JSON.stringify(novel) + ',');
  }
}

exports.start = start;
