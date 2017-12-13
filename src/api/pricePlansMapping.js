import { rest } from 'web-component-authentication';

/**
 * [getPricePlansMapping description]
 * @return {[type]} [description]
 */
export function getPricePlansMapping() {
  return rest
    .get(`${process.env.REACT_APP_BASE_URL}/price-plan-mappings`)
    .then(response => response.json())
    .then(json => json.data);
}
