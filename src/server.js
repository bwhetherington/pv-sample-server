import express from 'express';
import cors from 'cors';
import { queryGroup, groups, convertArtifact } from './data';
import { iterator, asyncIterator } from 'lazy-iters';
import scheduler from 'node-schedule';
import logger from './config/logger';
import { createMap } from './util';

function valueOrElse(value, other) {
  return value === null || value === undefined ? other : value;
}

const PORT = valueOrElse(process.env.PORT, 8888);

export default class Server {
  constructor(router = {}, port = PORT) {
    this.port = port;

    // All groups default to empty data
    this.data = createMap(groups, _ => []);

    const routings = {};
    for (const key of Object.keys(router)) {
      // Map server to this instance
      routings[key] = router[key](this);
    }
    this.router = routings;

    this.dailySample = [];
    this.updateSample();
  }

  start() {
    this.scheduleUpdates();
    const app = express();
    for (const key of Object.keys(this.router)) {
      app.get(key, cors(), this.router[key]);
    }
    app.listen(this.port, '0.0.0.0', () => {
      logger.debug(`server listening on port: ${this.port}`);
    });
  }

  scheduleUpdates() {
    // Schedule job to run every hour
    scheduler.scheduleJob('* * 1 * *', () => {
      this.updateSample();
    });
  }

  async updateSample() {
    // Update cached group data
    for (const group of groups) {
      const iter = asyncIterator(queryGroup(group));
      const groupData = await iter.collect();
      this.data[group] = groupData;
      logger.debug(`group '${group}' updated`);
    }

    const sample = iterator(Object.values(this.data))
      .flatten()
      .loop()
      .filter(_ => Math.random() < 0.0001)
      .take(3)
      .collect();

    this.dailySample = sample;
    logger.debug('sample updated');
  }
}
