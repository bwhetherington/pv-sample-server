import { asyncIterator } from 'lazy-iters';
import { groups, queryGroups } from '../data';
import logger from './logger';

function notFoundResponse(path) {
  return {
    description: `unknown resource '${path}'`
  };
}

const routes = {
  '/all': server => async (req, res) => {
    logger.info(`all artifacts requested by ip: ${req.ip}`);
    const data = asyncIterator(queryGroups(groups));
    const received = await data.collect();

    res.json(received);
  },
  '/sample': server => async (req, res) => {
    logger.info(`daily sample requested by ip: ${req.ip}`);
    const sample = server.dailySample;
    res.json(sample);
  },
  '/*': server => async (req, res) => {
    logger.error(`unknown resource '${req.path}' requested by ip: ${req.ip}`);
    res.status = 404;
    res.json(notFoundResponse(res.path));
  }
};

export default routes;
