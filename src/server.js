import express from 'express';
import cors from 'cors';
import { queryGroups, groups } from './data';
import { asyncIterator } from 'lazy-iters';
import scheduler from 'node-schedule';
import logger from './config/logger';

const PORT = process.env.PORT | 8888;

export default class Server {
  constructor(router = {}, port = PORT) {
    this.port = port;

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
    app.listen(this.port, () => {
      logger.info(`server listening on port: ${this.port}`);
    });
  }

  scheduleUpdates() {
    const rule = new scheduler.RecurrenceRule();
    rule.minute = new scheduler.Range(0, 59, 1);
    scheduler.scheduleJob(rule, () => {
      logger.debug('updating sample');
      this.updateSample();
    });
  }

  async updateSample() {
    const query = asyncIterator(queryGroups(groups));

    // Every artifact has a 1/10000 chance of being picked
    // This is really really really stupid
    // TODO replace this with something that is not awful for randomly selecting artifacts
    const sample = await query
      .loop()
      .filter(_ => Math.random() < 0.0001)
      .take(3)
      .collect();
    this.dailySample = sample;
  }
}
