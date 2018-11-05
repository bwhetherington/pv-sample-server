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
  // 'PV DATA 2014 KM Newly Documented Fountains',
  'PV FINAL DATA 2014 KM Fountains',
  'PV DATA Apr 2013 KM Flagstaff Pedestals'
];

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
