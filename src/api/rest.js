import Cookies from 'js-cookie';

export const getAccessToken = () => Cookies.get('accessToken');

/**
 * This is short form of performing a Fetch GET including a authorisation cookie.
 * @param {String} url URL of the api call.
 */
export function get(url) {
  const headers = {};
  if (getAccessToken()) {
    headers.jwt = getAccessToken();
  }
  return fetch(url, {
    method: 'GET',
    headers
  });
}

/**
 * This is short form of performing a Fetch PUT including a authorisation cookie
 * and setting the Content-Type to JSON.
 * @param {String} url URL of the api call.
 * @param {JSONString} Data in JSON string to be stringify.
 */
export function put(url, body) {
  return fetch(url, {
    method: 'Put',
    headers: {
      jwt: `${getAccessToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
}

/**
 * This is short form of performing a Fetch POST including a authorisation cookie
 * and setting the Content-Type to JSON.
 * @param {String} url URL of the api call.
 * @param {JSONString} Data in JSON string to be stringify.
 */
export function post(url, body) {
  const headers = {
    'Content-Type': 'application/json'
  };
  if (getAccessToken()) {
    headers.jwt = getAccessToken();
  }
  return fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });
}

export function del(url) {
  const headers = {
    'Content-Type': 'application/json'
  };
  if (getAccessToken()) {
    headers.jwt = getAccessToken();
  }
  return fetch(url, {
    method: 'DELETE',
    headers
  });
}
