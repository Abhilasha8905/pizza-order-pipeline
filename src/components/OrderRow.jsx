import React from 'react'
// import TimeAgo from 'react-timeago'

const pipelineType = {
  DOUGH: 'dough',
  TOPPING: 'toppping',
  OVEN: 'oven',
  SERVE: 'serve',
  DONE: 'done'
};

class StockRow extends React.Component {

  getEventStatus = (order, type) =>{
    if (!order[type]) return "Pending";
    return order[type].status;
  }

  render() {
    const { order } = this.props;
    return (
      <tr>
        <td>
          {order.id}
        </td>
        <td>
          {this.getEventStatus(order, pipelineType.DOUGH)}
        </td>
        <td>
          {this.getEventStatus(order, pipelineType.TOPPING)}
        </td>
        <td>
          {this.getEventStatus(order, pipelineType.OVEN)}
        </td>
        <td>
          {this.getEventStatus(order, pipelineType.SERVE)}
        </td>
        <td>
          {this.getEventStatus(order, pipelineType.DONE)}
        </td>
      </tr>
    );
  }
}

export default StockRow;