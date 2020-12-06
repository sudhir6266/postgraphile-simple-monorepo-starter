import { run } from 'graphile-worker';
import { pool } from "../config/database-pool";
import { taskList } from "./tasks";

export async function startWorkers() {
  return await run({
    pgPool: pool,
    concurrency: 5,
    noHandleSignals: false,
    pollInterval: 1000,
    taskList
  })
}
