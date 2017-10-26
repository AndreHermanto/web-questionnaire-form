import * as rest from './rest';

/**
 * [getPricePlans description]
 * @param  {[type]}        [description]
 * @return {[type]}        [description]
 */
export function getPricePlans() {
  return rest
    .get(`${process.env.REACT_APP_BASE_URL}/price-plans`)
    .then(response => response.json())
    .then(json => json.data);
}
