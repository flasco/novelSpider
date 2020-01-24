const Queue = require('../src/third-party/queue');

const queue = new Queue(5);

const delay = ms => new Promise(res => setTimeout(res, ms));

queue.work = async item => {
  const dly = (Math.random() * 3) >>> 0;
  await delay(dly * 1000);
  console.log('当前数字', item, 'sleep:', dly);
};

queue.drain = () => console.log('drain');

for (let i = 0; i < 100; i++) {
  queue.push(i);
}

// setTimeout(() => {
//   queue.kill();
// }, 10000);
