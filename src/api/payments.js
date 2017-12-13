import { rest } from 'web-component-authentication';

/**
 * [getPayments description]
 * @return {[type]} [description]
 */
export function getPayments() {
  return rest
    .get(`${process.env.REACT_APP_BASE_URL}/payments`)
    .then(response => response.json())
    .then(json => json.data);
}
