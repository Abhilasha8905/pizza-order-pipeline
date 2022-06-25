export default class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(element) {
    return this.items.push(element);
  }

  bulkEnqueue(elements) {
    this.items.push(...elements);
  }

  dequeue() {
    if (this.items.length > 0) {
      return this.items.shift();
    }
    return null;
  }

  peek() {
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length == 0;
  }

  size() {
    return this.items.length;
  }

  clear() {
    this.items = [];
  }
}
