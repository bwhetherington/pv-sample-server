import fetch from 'node-fetch';

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
  'PV DATA Feb 2013 KM Erratic Sculpture Symbols'
];

function queryUrl(baseUrl) {
  return `http://localhost:8080/static/json/${baseUrl}.json`;
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
