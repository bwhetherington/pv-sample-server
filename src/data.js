import fetch from 'node-fetch';
import { randomInt } from './util';

export const groups = [
  'PV DATA Feb 2013 KM Erratic Sculpture Coats of Arms',
  'PV DATA Feb 2013 KM Erratic Sculpture Crosses',
  'PV DATA Feb 2013 KM Erratic Sculpture Decorations',
  'PV DATA Feb 2013 KM Erratic Sculpture Fragments',
  'PV DATA Feb 2013 KM Erratic Sculpture Inscriptions',
  'PV DATA Feb 2013 KM Erratic Sculpture Other',
  'PV DATA Feb 2013 KM Erratic Sculpture Patere',
  'PV DATA Feb 2013 KM Erratic Sculpture Reliefs',
  'PV DATA Feb 2013 KM Erratic Sculpture Sculptures',
  'PV DATA Feb 2013 KM Erratic Sculpture Street Altars',
  'PV DATA Feb 2013 KM Erratic Sculpture Symbols',
  'PV FINAL DATA 2014 KM Fountains',
  'PV DATA Apr 2013 KM Flagstaff Pedestals'
];

const scaffoldingCost = 2180;

const defaultEstimates = {
  'PV DATA Feb 2013 KM Erratic Sculpture Coats of Arms': 3700,
  'PV DATA Feb 2013 KM Erratic Sculpture Crosses': 3700,
  'PV DATA Feb 2013 KM Erratic Sculpture Decorations': 3600,
  'PV DATA Feb 2013 KM Erratic Sculpture Fragments': 3600,
  'PV DATA Feb 2013 KM Erratic Sculpture Inscriptions': 3600,
  'PV DATA Feb 2013 KM Erratic Sculpture Other': 3600,
  'PV DATA Feb 2013 KM Erratic Sculpture Patere': 3700,
  'PV DATA Feb 2013 KM Erratic Sculpture Reliefs': 4700,
  'PV DATA Feb 2013 KM Erratic Sculpture Sculptures': 4700,
  'PV DATA Feb 2013 KM Erratic Sculpture Street Altars': 4700,
  'PV DATA Feb 2013 KM Erratic Sculpture Symbols': 3500,
  'PV FINAL DATA 2014 KM Fountains': 4700,
  'PV DATA Apr 2013 KM Flagstaff Pedestals': 4700
};

export function queryUrl(baseUrl) {
  return `http://ckdata2.herokuapp.com/api/v1/dataset.json?group_name=${baseUrl}`;
  // return `http://localhost:8080/static/json/${baseUrl}.json`;
}

export async function* queryGroup(group) {
  try {
    const url = queryUrl(group);
    const result = await fetch(url);
    const data = await result.json();
    yield* data;
  } catch (ex) {
    // Stop returning if we encounter an error
    return;
  }
}

/**
 * Produces an async generator of
 * @param {array} groups
 */
export async function* queryGroups(query = groups) {
  for (const group of query) {
    yield* queryGroup(group);
  }
}

export function fixArtifact(artifact) {
  let { amount_donated, cost_estimate, content, item_type } = artifact;
  if (typeof content === 'string') {
    content = JSON.parse(content);
  }

  if (cost_estimate === null || cost_estimate === undefined) {
    cost_estimate = defaultEstimates[item_type];
    if (cost_estimate === undefined) {
      cost_estimate = 0;
    }
  }

  if (amount_donated === null || amount_donated === undefined) {
    amount_donated = Math.round(Math.random() * cost_estimate);
  }

  return {
    ...artifact,
    content: {
      ...content,
      amount_donated,
      cost_estimate
    }
  };
}

export function convertArtifact(artifact) {
  const name = artifact.ck_id;
  const type = artifact.content.type;
  const namePretty = artifact.content.wiki_friendly_title;
  const coverImage = artifact.content.image_url;
  const amountNeeded = randomInt(500, 1000);
  const amountDonated = Math.floor(Math.random() * amountNeeded);
  const position = {
    lat: artifact.lat,
    lng: artifact.lng
  };
  return {
    name,
    namePretty,
    coverImage,
    type,
    amountDonated,
    amountNeeded,
    position,
    description: artifact.content.description_italian
  };
}
