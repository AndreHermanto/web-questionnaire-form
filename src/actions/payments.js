import * as api from '../api';
import * as schema from './schema';
import * as types from '../constants/paymentTypes';
import { normalize } from 'normalizr';

export function fetchPaymentsRequest() {
  return {
    type: types.FETCH_PAYMENTS_REQUEST
  };
}

export const fetchPaymentsSuccess = payments => ({
  type: types.FETCH_PAYMENTS_SUCCESS,
  payload: normalize(payments, schema.arrayOfPayments)
});

export const fetchPaymentsFailure = ex => {
  return {
    type: types.FETCH_PAYMENTS_FAILURE,
    ex
  };
};

export const fetchPayments = () => dispatch => {
  dispatch(fetchPaymentsRequest());
  return api
    .getPayments()
    .then(res => dispatch(fetchPaymentsSuccess(res)))
    .catch(ex => dispatch(fetchPaymentsFailure(ex)));
};
