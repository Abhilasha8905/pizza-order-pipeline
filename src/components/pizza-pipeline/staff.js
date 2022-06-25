import Queue from "./queue";
import ToppingQueue from "./topping-queue";
import Worker from "./worker";
import Config from "../../config";
/**
 * Create a queue for each pipeline
 */
const orderToDoughQ = new Queue();
const doughToToppingQ = new Queue();
const toppingToOvenQ = new Queue();
const ovenToServeQ = new Queue();
const completedQ = new Queue();

const createWorkerConfig = (name, timeToComplete, readQueue, writeQueue, lookUpInterval, eventNotifier, deq = 1) => {
  return {
    name,
    timeToComplete,
    readQueue,
    writeQueue,
    lookUpInterval,
    eventNotifier,
    deq
  }
};

const createWorkers = (count, config) => {
  return new Array(count).fill(0).map((k, i )=> new Worker({ ...config, workerNo: i+1 }))
};

const workersInit = ({ eventNotifier, getOrders }) => {
  const doughs = createWorkers(
    Config.DOUGH.COUNT,
    createWorkerConfig(
      'dough',
      Config.DOUGH.TIME_TO_FINISH_IN_SEC * 1000,
      orderToDoughQ,
      doughToToppingQ,
      Config.WORKER_LOOK_UP_INTERVAL_IN_MS,
      eventNotifier
    )
  );

  const outToppings = new ToppingQueue(toppingToOvenQ, getOrders);
  const toppers = createWorkers(
    Config.TOPPING.COUNT,
    createWorkerConfig(
      'topping',
      Config.TOPPING.TIME_TO_FINISH_IN_SEC * 1000,
      doughToToppingQ,
      outToppings,
      Config.WORKER_LOOK_UP_INTERVAL_IN_MS,
      eventNotifier,
      2
    )
  );

  const ovens = createWorkers(
    Config.OVEN.COUNT,
    createWorkerConfig(
      'oven',
      Config.OVEN.TIME_TO_FINISH_IN_SEC * 1000,
      toppingToOvenQ,
      ovenToServeQ,
      Config.WORKER_LOOK_UP_INTERVAL_IN_MS,
      eventNotifier
    )
  );

  const servers = createWorkers(
    Config.SERVER.COUNT,
    createWorkerConfig(
      'serve',
      Config.SERVER.TIME_TO_FINISH_IN_SEC * 1000,
      ovenToServeQ,
      completedQ,
      Config.WORKER_LOOK_UP_INTERVAL_IN_MS,
      eventNotifier
    )
  );

  return { workers: [doughs, toppers, ovens, servers], orderToDoughQ, completedQ }
}

export default workersInit;
