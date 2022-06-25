export default class Worker {
  constructor({ name, timeToComplete, readQueue, writeQueue, lookUpInterval, workerNo, eventNotifier, deq = 1 }) {
    this.intervalId = null;
    this.isWorking = false;

    this.name = name;
    this.timeToComplete = timeToComplete; // in ms
    this.readQueue = readQueue;
    this.writeQueue = writeQueue;
    this.lookUpInterval = lookUpInterval; // in ms
    this.workerNo = workerNo;
    this.eventNotifier = eventNotifier;
    this.deq = deq;
  }

  start = () => {
    this.intervalId = setInterval(() => {
      if (!this.isWorking && this.readQueue.size() > 0) {
        let orders = this.deq === 1 ? [this.readQueue.dequeue()] : [this.readQueue.dequeue(), this.readQueue.dequeue()];
        orders = orders.filter(k => k);
        console.log("I am worker", this.name, " and I picked ", orders);
        this.isWorking = true;
        if (this.name === "topping") {
          orders.map(k => this.eventNotifier({ type: "TOPPING", id: k.orderId }));
        }

        // fire an event to notify
        orders.forEach(order => this.eventNotifier({ ...order, [this.name]: { status: "In Progress", workerNo: this.workerNo, at: new Date() } }));

        setTimeout(() => {
          const allObjs = [];
          orders.forEach(order => {
            const obj = { ...order, [this.name]: { status: 'Completed', workerNo: this.workerNo, at: new Date() } };
            this.eventNotifier({ ...obj });
            allObjs.push(obj);
          })

          // hack for now
          if (this.name !== 'dough') {
            allObjs.forEach(obj => this.writeQueue.enqueue(obj));
          } else {
            allObjs.forEach(obj => {
              this.writeQueue.bulkEnqueue(obj.toppings.map(k => ({ orderId: obj.id, topping: k })));
            });
          }
          this.isWorking = false;
        }, this.timeToComplete * this.deq);
      }
    }, this.lookUpInterval);
  }

  end() {
    clearInterval(this.intervalId);
  }
}