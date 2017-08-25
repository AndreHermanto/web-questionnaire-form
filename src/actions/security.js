import { setAccessToken, removeAccessToken } from '../cookies';
import * as api from '../api';
import * as securityTypes from '../constants/SecurityTypes';

export const decryptTokens = (userId, consentTypeId, timestamp) => (
  dispatch,
  getState
) => {
  dispatch({
    type: securityTypes.DECRYPT_TOKENS_REQUEST
  });
  if (userId && consentTypeId && timestamp) {
    // we dont need the JWT, so kill it
    removeAccessToken();
  }
  return api
    .decryptTokens(userId, consentTypeId, timestamp)
    .then(response => {
      if (!response.ok) {
        return Promise.reject(response);
      }
      return response.json();
    })
    .then(tokens => {
      // set jwt
      setAccessToken(tokens.jwt);
      dispatch({
        type: securityTypes.DECRYPT_TOKENS_SUCCESS,
        payload: tokens
      });
    })
    .catch(error => {
      dispatch({
        type: securityTypes.DECRYPT_TOKENS_FAILURE
      });
      return Promise.reject(error);
    });
};
