import XslaSpider from '../spider/xsla.spider';

const parserArr = [
  null,
  new XslaSpider(),
];

export function spiderFactory(url) {
  let index = ((`${url}`).indexOf('www.xs.la') > -1) && 1
    || -1;
  return index !== -1 ? parserArr[index] : null;
}