const EventEmitter = require('events').EventEmitter;

class Queue {
  constructor(concurrent) {
    this._id = 0;
    this._preArr = [];
    this._workArr = [];
    this._concurrent = concurrent || 5;
    this.inProcess = 0;

    this._workEMT = new EventEmitter();

    this._workEMT.on('work', this._workRun.bind(this));
    this._workEMT.on('start', this._workPush.bind(this));
  }

  _workPush() {
    while (this._preArr.length > 0 && this._workArr.length < this._concurrent) {
      const item = this._preArr.shift();
      this._workArr.push(item);
    }
    this._workEMT.emit('work');
  }

  _workRun() {
    const workLen = this._workArr.length;

    for (let i = 0; i < workLen; i++) {
      const current = this._workArr[i];
      if (current.isWorking !== 1) {
        current.isWorking = 1;
        this.inProcess++;
        this.work(current.content).then(() => {
          this.inProcess--;
          const curWorkLen = this._workArr.length;
          const curTotalLen = curWorkLen + this._preArr.length;

          if (this.inProcess < 1 && curTotalLen < 1) this.drain();
          if (curWorkLen < 1) return;

          const pos = this._workArr.findIndex(val => current.id === val.id);
          this._workArr.splice(pos, 1);
          this._workEMT.emit('start');
        });
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
    this._workArr.length < 1 && this._workEMT.emit('start');
  }

  kill() {
    this._workArr = [];
    this._preArr = [];
  }

  async work(item) {
    return new Promise(resolve => {
      console.log('default work, plz overload it', item);
      setTimeout(resolve, 1000);
    });
  }
}

module.exports = Queue;
