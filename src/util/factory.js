const xsSpider = require('../spider/xsla');
const biquSpider = require('../spider/biqu');
const booktxtSpider = require('../spider/booktxt');

const spiderMap = {
  'xs': xsSpider,
  'biqu': biquSpider,
  'booktxt': booktxtSpider,
}

function spiderFactory(site) {
  const spider = spiderMap[site];
  if (spider != null) {
    return spider;
  }
  throw new Error('error: invalid site');
}

module.exports = spiderFactory;