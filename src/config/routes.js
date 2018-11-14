import { iterator } from 'lazy-iters';
import logger from './logger';

function notFoundResponse(path) {
  return {
    error: `unknown resource: '${path}'`
  };
}

function groupNotFound(group) {
  return {
    error: `unknown group: '${group}'`
  };
}

const noGroupSpecified = {
  error: 'no group specified'
};

const noItemSpecified = {
  error: 'no item specified'
};

function itemNotFound(item) {
  return {
    error: `unknown item: ${item}`
  };
}

const routes = {
  '/all': server => async (req, res) => {
    logger.info(`all artifacts requested by ip: ${req.ip}`);
    await server.waitUntilLoaded();
    const data = iterator(Object.values(server.data))
      .map(({ items }) => items)
      .flatten()
      .collect();

    res.json(data);
  },
  '/sample': server => async (req, res) => {
    logger.info(`daily sample requested by ip: ${req.ip}`);
    await server.waitUntilLoaded();
    const sample = server.dailySample;
    res.json(sample);
  },
  '/groups/:group': server => async (req, res) => {
    const { group } = req.params;
    const groupName = group.replace(/%20/g, ' ');
    const data = server.data[groupName];
    if (data !== null && data !== undefined) {
      if (data.length == 0) {
        logger.warn(`group '${groupName}' is empty`);
      }
      logger.info(`group '${groupName}' requested by ip: ${req.ip}`);
      // Spin until group is loaded
      await server.waitUntilLoaded();
      res.json(server.data[groupName].items);
    } else {
      logger.warn(`unknown group '${groupName}' requested by ip: ${req.ip}`);
      res.json(groupNotFound(groupName));
    }
  },
  '/groups': _ => async (_, res) => res.json(noGroupSpecified),
  '/items/:item': server => async (req, res) => {
    const { item } = req.params;
    if (item !== null && item !== undefined) {
      const member = iterator(Object.values(server.data))
        .map(({ items }) => items)
        .flatten()
        .filter(
          artifact =>
            artifact !== null && artifact !== undefined && item.localeCompare(artifact.ck_id) === 0
        )
        .first();
      if (member !== undefined) {
        res.json(member);
      } else {
        res.json(itemNotFound(item));
      }
    } else {
      res.json(noItemSpecified);
    }
  },
  '/items': _ => async (_, res) => res.json(noItemSpecified),
  '*': _ => async (req, res) => {
    logger.warn(`unknown resource '${req.path}' requested by ip: ${req.ip}`);
    res.status = 404;
    res.json(notFoundResponse(res.path));
  }
};

export default routes;
