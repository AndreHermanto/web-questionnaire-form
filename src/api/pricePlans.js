import * as rest from './rest';

/**
 * [getPricePlan description]
 * @param  {[string]}      [id]
 * @return {[type]}        [description]
 */
export function getPricePlan(id) {
  return rest
    .get(
      `${process.env.REACT_APP_BASE_URL}/price-plans/${encodeURIComponent(id)}`
    )
    .then(response => response.json())
    .then(json => json.data);
}
