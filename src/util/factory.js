const xsSpider = require('../spider/xsla.spider');
const biquSpider = require('../spider/biqu.spider');

const spiderMap = {
  'xs': xsSpider,
  'biqu': biquSpider,
}

function spiderFactory(site) {
  const spider = spiderMap[site];
  if (spider != null) {
    return spider;
  }
  throw new Error('error: invalid site');
}

module.exports = spiderFactory;