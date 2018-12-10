const xsSpider = require('../spider/xsla.spider');
const biquSpider = require('../spider/biqu.spider');

const spiderMap = {
  'xs': xsSpider,
  'biqu': biquSpider,
}

/**
 * @param {string} site 站点
 * @return {Function} spider
 */
module.exports = function (site) {
  const spider = spiderMap[site];
  if (spider != null) {
    return spider;
  }
  throw new Error('error: invalid site');
}