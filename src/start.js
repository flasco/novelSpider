const sipderFactory = require('./util/factory');
const { checkDir } = require('./util');

// excepts like this: xs '0 40'
const argvs = process.argv.splice(2);

checkDir();

const spider = sipderFactory(argvs[0]);

const [start, end] = argvs[1].split(' ').map(item => {
  const ret = +item;
  if (isNaN(ret)) throw new Error('invalid range');
  return ret;
});

const checkFail = !!argvs[2];

if (end == null) throw new Error('invalid range');

console.log(`spider: ${argvs[0]}, range: [${start}, ${end}], checkFail: ${checkFail}`);

spider.start(start, end, checkFail);
