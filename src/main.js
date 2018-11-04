import Server from './server';
import { queryGroups, groups } from './data';

function notFoundResponse(path) {
  return {
    description: `The resource '${path}' could not be found.`
  };
}

const routingInfo = {
  '/all': server => async (req, res) => {
    const received = [];

    const data = await queryGroups(groups);
    for await (const artifact of data) {
      received.push(artifact);
    }

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
