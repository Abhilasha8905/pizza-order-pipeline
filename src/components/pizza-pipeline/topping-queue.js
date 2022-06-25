class ToppingQueue {
  constructor(nextQueue, getOrders) {
    this.items = [];
    this.orders = getOrders;
    this.nextQueue = nextQueue;
  }

  enqueue(element) {
    this.items.push(element);
    // check if order is completed
    const orderId = element.orderId;
    const allToppings = this.items.filter(o => o.orderId === orderId);
    const thisOrder = this.orders().find(o => o.id === orderId);

    if (allToppings.length === thisOrder.toppings.length) {
      this.nextQueue.enqueue({ ...thisOrder, topping: { status: 'Completed', at: new Date() } });
    }
  }
}


export default ToppingQueue;