const Queue = require('../src/third-party/queue');

const queue = new Queue(5);
queue.drain = () => console.log('drain');
for (let i = 0; i < 100; i++) {
  queue.push(i);
}

setTimeout(() => {
  queue.kill();
}, 4000);
