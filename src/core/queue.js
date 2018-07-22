import async from 'async';
import { spiderFactory } from './factory';
import { sleep } from '../utils'

class Queue {
  constructor() {
    this.queue = async.queue(this.queueList, 5);
    this.queue.drain = this.drain;
  }

  queueList = (url, callback) => {
    spiderFactory(url).fetch(url).then(() => {
      sleep(1200).then(() => callback())
    });
  }

  drain = () => {
    console.log('all is finished.');
  }

  run = () => {
    this.queue.push('https://www.xs.la/10_10111/');
  }
}

export default Queue;