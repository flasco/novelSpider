const iconv = require('iconv-lite');
const cheerio = require('cheerio');
const queue = require('async/queue');
const path = require('path');
const { appendContent, sleep, crawlPage, isDocker } = require('../util');

let fileName;

let failCnt = 0;

const BiquQueue = queue(async (url, callback) => {
  await fetchList(url);
  await sleep(1200);
  callback();
}, 5);

BiquQueue.drain = () => {
  console.log('[info]biqu.cm | finish...');

  appendContent(fileName, ']}');
};

function fetc(start = 0, end = 40) {
  fileName = isDocker
    ? path.resolve('/data/biqu', `biqu-${start}-${end}.json`)
    : path.resolve(__dirname, `../../fetched/biqu/biqu-${start}-${end}.json`);
  appendContent(fileName, '{ "results": [');
  for (let i = start; i <= end; i++) {
    for (let j = 1000 * i, top = 1000 * (i + 1); j < top; j++) {
      BiquQueue.push(`http://www.biqu.cm/${i}_${j}/`);
    }
  }
}

async function fetchList(url) {
  if (failCnt > 100) {
    console.log('need end.');
    XsQueue.kill();
    appendContent(fileName, ']}');
  }
  let { err, data } = await crawlPage(url);
  if (!err) {
    if (data == '') {
      failCnt++;
      console.log(`[info]biqu.cm | Jump! failCnt: ${failCnt}`);
      return;
    }
    data = iconv.decode(data, 'gbk');
    let $ = cheerio.load(data, { decodeEntities: false });

    let tempVal = $(`meta[property='og:novel:read_url']`);
    if (tempVal.length === 0) {
      console.log('[info]biqu.cm | Error,jmp');
      return;
    }
    let xurl = tempVal[0].attribs.content;
    let name = $(`meta[property='og:novel:book_name']`)[0].attribs.content;
    let author = $(`meta[property='og:novel:author']`)[0].attribs.content;
    let img = $(`meta[property='og:image']`)[0].attribs.content;
    let desc = $(`meta[property='og:description']`)[0].attribs.content;

    desc = desc.replace(/<br\/>/g, '\n');

    let novel = {
      name,
      author,
      url: xurl,
      img,
      desc,
      plantFormId: 3
    };

    console.log(`[info]biqu.cm | ${novel.name} ${novel.url}`);
    failCnt = 0;
    appendContent(fileName, JSON.stringify(novel) + ',');
  }
}

exports.start = fetc;
