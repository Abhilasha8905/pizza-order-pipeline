import React from 'react'
import OrdersList from "./OrdersList.jsx";
import workersInit from "./pizza-pipeline/staff";
import { getTimeTaken } from "../util";

class Dashboard extends React.Component {

  state = {
    orders: [],
    workers: [],
    toppingsStarted: [],
    orderToDoughQ: null,
    completedQ: null
  }

  eventNotifier = (payload) => {
    if (payload.type === "TOPPING") {
      const toppingsStarted = this.state.toppingsStarted;
      this.setState({ toppingsStarted: [payload.id, ...toppingsStarted]});
      return;
    }
    const copyOrders = [...this.state.orders];
    const findIndex = copyOrders.findIndex(o => o.id === payload.id);
    copyOrders[findIndex] = payload;
    this.setState({ orders: copyOrders });
  }

  getOrders = () => this.state.orders;

  componentDidMount() {
    const { workers, orderToDoughQ } = workersInit({ eventNotifier: this.eventNotifier, getOrders: this.getOrders });
    this.workers = workers;
    this.orderToDoughQ = orderToDoughQ;
    this.workers.flat().map(k => k.start());
  }

  componentWillUnmount() {
    this.workers.flat().map(k => k.end());
  }

  addOrder = (size) => {
    if (size <=0) { alert("No of toppings > 0"); return;}
    const newOrder = { id: this.state.orders.length + 1, toppings: Array.from({length: size}, (_, i) => i + 1), createdAt: new Date() };
    this.setState({ orders: [newOrder, ...this.state.orders] }, () => {
      this.orderToDoughQ.enqueue(newOrder)
    });
  }

  downloadReport = () => {
    const csvData = [[
      "Order No",
      "Created At",
      "Dough Completed After",
      "Toppings Completed After",
      "Oven Completed After",
      "Served After",
    ]];
    const copyOrders = [...this.state.orders];
    copyOrders.reverse().forEach(order => {
      const t1 = getTimeTaken(order.dough.at, order.createdAt);
      const t2 = getTimeTaken(order.topping.at, order.createdAt);
      const t3 = getTimeTaken(order.oven.at, order.createdAt);
      const t4 = getTimeTaken(order.serve.at, order.createdAt);

      csvData.push([
        order.id,
        `"${order.createdAt.toLocaleString()}"`,
        `"${t1} secs"`,
        `"${t2} secs"`,
        `"${t3} secs"`,
        `"${t4} secs"`
      ]);
    });
    const csvContent = "data:text/csv;charset=utf-8," + csvData.map(e => e.join(",")).join("\n");
    window.open(encodeURI(csvContent));
  }

  render() {
    return (
      <div className='container'>
        <div className='columns'>
          <OrdersList
            toppingsStarted={this.state.toppingsStarted}
            orders={this.state.orders}
            addOrder={this.addOrder}
            downloadReport={this.downloadReport}
          />
        </div>
      </div>
    );
  }
}

export default Dashboard;
