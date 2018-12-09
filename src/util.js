import fs from 'fs';
import util from 'util';

export const readFileAsync = util.promisify(fs.readFile);

export async function asyncTake(iter, n) {
  const taken = [];
  let i = 0;
  for await (const x of iter) {
    i++;
    if (i > n) {
      break;
    }
    taken.push(x);
  }
  return taken;
}

export async function* asyncSkip(iter, n) {
  let i = 0;
  for await (const x of iter) {
    i++;
    if (i > n) {
      yield x;
    }
  }
}

/**
 * Generates a random integer in the range [low, high).
 * @param {number} low the lower bound
 * @param {number} high the upper bound
 */
export function randomInt(low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}

export function createMap(keys, f) {
  return Object.assign(...keys.map(key => ({ [key]: f(key) })));
}
