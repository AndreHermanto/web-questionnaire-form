import * as api from '../api';
import * as schema from './schema';
import * as types from '../constants/pricePlanTypes';
import { normalize } from 'normalizr';

export function fetchPricePlansRequest() {
  return {
    type: types.FETCH_PRICEPLANS_REQUEST
  };
}

export const fetchPricePlansSuccess = pricePlans => ({
  type: types.FETCH_PRICEPLANS_SUCCESS,
  payload: normalize(pricePlans, schema.arrayOfPricePlans)
});

export const fetchPricePlansFailure = ex => {
  return {
    type: types.FETCH_PRICEPLANS_FAILURE,
    ex
  };
};

export const fetchPricePlans = () => dispatch => {
  dispatch(fetchPricePlansRequest());
  return api
    .getPricePlans()
    .then(res => dispatch(fetchPricePlansSuccess(res)))
    .catch(ex => dispatch(fetchPricePlansFailure(ex)));
};
