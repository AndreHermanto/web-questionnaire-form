import * as rest from './rest';

/**
 * [getPricePlansMapping description]
 * @return {[type]} [description]
 */
export function getPricePlansMapping() {
  return rest
    .get(`${process.env.REACT_APP_BASE_URL}/price-plans-mappings`)
    .then(response => response.json())
    .then(json => json.data);
}
