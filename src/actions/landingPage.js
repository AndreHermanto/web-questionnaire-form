import * as types from '../constants/ConsentTypes';
import * as api from '../api';
import get from 'lodash.get';

export const fetchLandingPageRequest = () => ({
  type: types.FETCH_LANDING_PAGE_REQUEST
});

export const fetchLandingPageSuccess = payload => ({
  type: types.FETCH_LANDING_PAGE_SUCCESS,
  payload
});

export const fetchLandingPageFailure = error => ({
  type: types.FETCH_LANDING_PAGE_FAILURE,
  payload: error
});

export const fetchLandingPage = consentTypeId => dispatch => {
  dispatch(fetchLandingPageRequest());
  return api
    .getConsentTypeLandingPage(consentTypeId)
    .then(response => response.json())
    .then(json => {
      if (get(json.data, 0)) {
        dispatch(fetchLandingPageSuccess(get(json.data, 0)));
      } else {
        dispatch(fetchLandingPageFailure(json.data));
      }
    })
    .catch(error => dispatch(fetchLandingPageFailure(error)));
};
