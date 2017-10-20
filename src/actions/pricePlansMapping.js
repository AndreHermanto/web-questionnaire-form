import * as api from '../api';
import * as schema from './schema';
import * as types from '../constants/pricePlansMappingTypes';
import { normalize } from 'normalizr';

/**
 * fetch
 * @OPERATION GET
 */
export const fetchPricePlansMappingRequest = () => {
  return {
    type: types.FETCH_PRICEPLANSMAPPING_REQUEST
  };
};

export const fetchPricePlansMappingSuccess = pricePlans => ({
  type: types.FETCH_PRICEPLANSMAPPING_SUCCESS,
  payload: normalize(pricePlans, schema.arrayOfPricePlansMapping)
});

export const fetchPricePlansMappingFailure = ex => {
  return {
    type: types.FETCH_PRICEPLANSMAPPING_FAILURE,
    ex
  };
};

export const fetchPricePlansMapping = () => dispatch => {
  dispatch(fetchPricePlansMappingRequest());
  return api
    .getPricePlansMapping()
    .then(res => dispatch(fetchPricePlansMappingSuccess(res)))
    .catch(ex => dispatch(fetchPricePlansMappingFailure(ex)));
};
