import express from 'express';
import { queryGroups, groups } from './data';
import { asyncTake, asyncSkip, randomInt } from './util';
import asyncIterator from './iterator/async';
import scheduler from 'node-schedule';

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
      app.get(key, this.router[key]);
    }
    app.listen(this.port, () => {
      console.log(`Server listening on port ${this.port}`);
    });
  }

  scheduleUpdates() {
    const rule = new scheduler.RecurrenceRule();
    rule.minute = new scheduler.Range(0, 59, 1);
    scheduler.scheduleJob(rule, () => {
      console.log('updating sample');
      this.updateSample();
    });
  }

  async updateSample() {
    const query = asyncIterator(queryGroups(groups));
    const numToSkip = randomInt(0, 100);
    // Every artifact has a 1/100 chance of being picked
    // May not actually produce 3 artifacts
    // This is really really really stupid
    // TODO replace this with something that is not awful for randomly selecting artifacts
    const sample = await query
      .filter(_ => Math.random() < 0.01)
      .map(artifact => artifact.content.wiki_friendly_title)
      .take(3);
    this.dailySample = sample;
  }
}
