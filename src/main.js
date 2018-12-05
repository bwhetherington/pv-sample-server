import Server from './server';
import routes from './config/routes';

import { asyncIterator, iterator } from 'lazy-iters';
import fetch from 'node-fetch';

import { writeFile } from 'fs';

async function* queryAll() {
  const url = 'http://localhost:8888/all';
  const result = await fetch(url);
  const data = await result.json();

  yield* data;
}

async function run() {
  const list = await asyncIterator(queryAll())
    .map(artifact => ({
      id: artifact.ck_id,
      before: artifact.content.condition_in_1987,
      after: artifact.content.condition_in_2000
    }))
    .filter(artifact => iterator(Object.values(artifact)).all(field => field !== undefined))
    .map(({ id, before, after }) => ({
      id,
      before: parseInt(before[0]),
      after: parseInt(after[0])
    }))
    .collect();
  writeFile('conditions.json', JSON.stringify(list), console.log);
}

function main() {
  run();

  // const server = new Server(routes);
  // server.start();
}

main();
