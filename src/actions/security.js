import Cookies from 'js-cookie';
import * as api from '../api';
import * as securityTypes from '../constants/SecurityTypes';

export const decryptTokens = (userId, consentTypeId, timestamp) => (
  dispatch,
  getState
) => {
  dispatch({
    type: securityTypes.DECRYPT_TOKENS_REQUEST
  });
  return api
    .decryptTokens(userId, consentTypeId, timestamp)
    .then(response => {
      if (!response.ok) {
        var error = new Error(response.statusText || response.status);
        error.response = response;
        return Promise.reject(error);
      }
      return response.json();
    })
    .then(tokens => {
      // set jwt
      Cookies.set('accessToken', tokens.jwt);
      dispatch({
        type: securityTypes.DECRYPT_TOKENS_SUCCESS,
        payload: tokens
      });
    })
    .catch(e => {
      dispatch({
        type: securityTypes.DECRYPT_TOKENS_FAILURE
      });
      throw e;
    });
};
