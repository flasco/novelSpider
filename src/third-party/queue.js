const EventEmitter = require('events').EventEmitter;

class Queue {
  constructor(concurrent) {
    this._id = 0;
    this._preArr = [];
    this._workArr = [];
    this._concurrent = concurrent || 5;
    this._inProcess = 0;

    this._workEMT = new EventEmitter();

    this._workEMT.on('work', this._workRun.bind(this));
    this._workEMT.on('start', this._workPush.bind(this));
  }

  _workPush() {
    while (this._preArr.length > 0 && this._workArr.length < this._concurrent) {
      const item = this._preArr.shift();
      this._workArr.push(item);
    }

    const totalLen = this._workArr.length + this._preArr.length;

    if (totalLen < 1 && this._inProcess < 1) this.drain();
    else this._workEMT.emit('work');
  }

  async _workRun() {
    const workLen = this._workArr.length;

    for (let i = 0; i < workLen; i++) {
      const current = this._workArr[i];
      if (current && current.isWorking !== 1) {
        current.isWorking = 1;
        this._inProcess++;
        await this.work(current.content);
        this._inProcess--;
        const pos = this._workArr.findIndex(val => current.id === val.id);
        this._workArr.splice(pos, 1);

        this._workEMT.emit('start');
      }
    }
  }

  drain() {
    console.log('empty...');
  }

  push(item) {
    this._preArr.push({
      id: this._id++,
      content: item
    });
    this._workArr.length < this._concurrent && this._workEMT.emit('start');
  }

  kill() {
    this._workArr = [];
    this._preArr = [];
  }

  async work(item) {
    return new Promise(resolve => {
      console.log('default work, plz overload it', item);
      setTimeout(resolve, (Math.random() * 5000) | 0);
    });
  }
}

module.exports = Queue;
