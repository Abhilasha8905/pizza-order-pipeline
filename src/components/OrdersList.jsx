import React from 'react'
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { getTimeTaken } from "../util";
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import InfoIcon from '@mui/icons-material/Info';





const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const OrderList = (props) => {
  const [toppings, setToppings] = React.useState(null);
  const pipelineType = {
    DOUGH: 'dough',
    TOPPING: 'topping',
    OVEN: 'oven',
    SERVE: 'serve',
    DONE: 'done'
  };

  const statusColorMap = {
    Pending: 'pending',
    'In Progress': 'inProgress',
    Completed: 'completed'
  };

  const { orders, addOrder, downloadReport, toppingsStarted } = props;

  const allOrdersServed = () => {
    return orders.length > 0 && orders.every(order => order.serve && order.serve.status === "Completed");
  };

  const getEventStatus = (order, type) => {
    if (type === pipelineType.DONE) {
      if (order[pipelineType.SERVE] && order[pipelineType.SERVE].status === "Completed") {
        return { status: "Completed", color: "completed", workerNo: order[pipelineType.SERVE].workerNo, time: getTimeTaken(order[pipelineType.SERVE].at, order.createdAt) }
      }
      return { status: "Pending", color: "pending", time: null }
    }
    if (!order[type] && type === pipelineType.TOPPING && toppingsStarted.includes(order.id)) {
      return { status: "In Progress", color: "inProgress", time: null }
    }
    if (!order[type]) return { status: "Pending", color: statusColorMap.Pending };
    return { status: order[type].status, workerNo: order[type].workerNo, color: statusColorMap[order[type].status] };
  }

  return (
    <div>
      <div>
        <input type="number" placeholder="Add number of toppings" onChange={e => setToppings(e.target.value)} />
        &nbsp;
        &nbsp;
        <Button variant="contained" onClick={() => addOrder(toppings)}>Add Order</Button>

        {allOrdersServed() && <Button variant="contained" onClick={downloadReport} style={{ float: 'right' }}>Download Report</Button>}
      </div>
      <div style={{ margin: 20 }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Order No</StyledTableCell>
                <StyledTableCell>Dough<HtmlTooltip
                  title={
                    <React.Fragment>
                      <Typography color="inherit"> Two dough chefs</Typography>
                      Each chef can handle one dough at a time. It takes 7 seconds to
                      prepare each dough.
                    </React.Fragment>
                  }
                >
                  <Button><InfoIcon /></Button>
                </HtmlTooltip></StyledTableCell>
                <StyledTableCell>Topping <HtmlTooltip
                  title={
                    <React.Fragment>
                      <Typography color="inherit">Three topping chefs</Typography>
                      Each chef can handle 2 toppings at a time. It takes 4 seconds to
                      put each topping on the Pizza.
                    </React.Fragment>
                  }
                >
                  <Button><InfoIcon /></Button>
                </HtmlTooltip></StyledTableCell>
                <StyledTableCell>Oven <HtmlTooltip
                  title={
                    <React.Fragment>
                      <Typography color="inherit">One oven</Typography>
                      Oven takes one pizza each time and cook it for 10 seconds.
                    </React.Fragment>
                  }
                >
                  <Button><InfoIcon /></Button>
                </HtmlTooltip></StyledTableCell>
                <StyledTableCell>Serving<HtmlTooltip
                  title={
                    <React.Fragment>
                      <Typography color="inherit">`Two waiters</Typography>
                      Waiters serve the pizza to the customers. From the kitchen to the table it
                      takes 5 seconds.
                    </React.Fragment>
                  }
                >
                  <Button><InfoIcon /></Button>
                </HtmlTooltip></StyledTableCell>
                <StyledTableCell>Completed</StyledTableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <StyledTableRow key={order.id}>
                  <StyledTableCell component="th" scope="row">
                    {order.id} (Toppings: {order.toppings && order.toppings.length})
                  </StyledTableCell>
                  <StyledTableCell>
                    <span className={getEventStatus(order, pipelineType.DOUGH).color}>
                      {getEventStatus(order, pipelineType.DOUGH).status}
                    </span>
                  </StyledTableCell>
                  <StyledTableCell >
                    <span className={getEventStatus(order, pipelineType.TOPPING).color}>
                      {getEventStatus(order, pipelineType.TOPPING).status}
                    </span>
                  </StyledTableCell>
                  <StyledTableCell>
                    <span className={getEventStatus(order, pipelineType.OVEN).color}>
                      {getEventStatus(order, pipelineType.OVEN).status}
                    </span>
                  </StyledTableCell>
                  <StyledTableCell>
                    <span className={getEventStatus(order, pipelineType.SERVE).color}>
                      {getEventStatus(order, pipelineType.SERVE).status}
                    </span>
                  </StyledTableCell>
                  <StyledTableCell>
                    <span className={getEventStatus(order, pipelineType.DONE).color}>
                      {getEventStatus(order, pipelineType.DONE).status}
                      {getEventStatus(order, pipelineType.DONE).time ? ` (in ${getEventStatus(order, pipelineType.DONE).time} secs)` : null}
                    </span>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

    </div>
  );
};

export default OrderList;