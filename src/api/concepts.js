import * as rest from './rest';

/**
 * [getPricePlan description]
 * @param  {[string]}      [id]
 * @return {[type]}        [description]
 */
export function getConcepts(prefix, datasources) {
  return rest
    .get(
      `${
        process.env.REACT_APP_BASE_URL
      }/prefix-search/concepts?prefix=${prefix}&datasources=${datasources}`
    )
    .then(response => response.json())
    .then(json => json.data);
}
