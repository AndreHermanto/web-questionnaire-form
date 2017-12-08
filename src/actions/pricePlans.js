import * as api from '../api';
import * as schema from './schema';
import * as types from '../constants/pricePlanTypes';
import { normalize } from 'normalizr';

export function fetchPricePlansRequest() {
  return {
    type: types.FETCH_PRICEPLANS_REQUEST
  };
}

export const fetchPricePlansSuccess = pricePlans => {
  const pricePlansArray = Array.isArray(pricePlans) ? pricePlans : [pricePlans];
  return {
    type: types.FETCH_PRICEPLANS_SUCCESS,
    payload: normalize(pricePlansArray, schema.arrayOfPricePlans)
  };
};

export const fetchPricePlansFailure = ex => {
  return {
    type: types.FETCH_PRICEPLANS_FAILURE,
    ex
  };
};

export const fetchPricePlan = pricePlanId => dispatch => {
  dispatch(fetchPricePlansRequest());
  return api
    .getPricePlan(pricePlanId)
    .then(res => dispatch(fetchPricePlansSuccess(res)))
    .catch(ex => dispatch(fetchPricePlansFailure(ex)));
};
