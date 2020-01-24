import { EventEmitter } from 'events';

declare class Queue<T> {
  constructor(concurrent: number);

  drain(): void;

  push(item: T): void;

  kill(): void;

  work(item: T): Promise<void>
}

export = Queue;
