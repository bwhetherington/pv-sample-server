import Server from './server';
import { queryGroups, groups } from './data';
import asyncIterator from './iterator/async';
import iterator from './iterator/sync';

function notFoundResponse(path) {
  return {
    description: `The resource '${path}' could not be found.`
  };
}

const routingInfo = {
  '/all': server => async (req, res) => {
    const data = asyncIterator(queryGroups(groups));
    const received = await data.collect();

    res.json(received);
  },
  '/sample': server => async (req, res) => {
    const sample = server.dailySample;
    res.json(sample);
  },
  '/*': server => async (req, res) => {
    res.json(notFoundResponse(req.path));
  }
};

function main() {
  const server = new Server(routingInfo);
  server.start();
}

main();
