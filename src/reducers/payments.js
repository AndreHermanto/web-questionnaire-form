import { combineReducers } from 'redux-immutable';
import { fromJS, List } from 'immutable';
import * as types from '../constants/paymentTypes';
import { dedup } from '../helpers';

const byId = (state = fromJS({}), action) => {
  switch (action.type) {
    case types.FETCH_PAYMENTS_SUCCESS:
      return state.merge(fromJS(action.payload.entities.payments));
    default:
      return state;
  }
};

const allIds = (state = List(), action) => {
  switch (action.type) {
    case types.FETCH_PAYMENTS_SUCCESS:
      return dedup(state.concat(fromJS(action.payload.result)));
    default:
      return state;
  }
};

const payments = combineReducers({
  byId,
  allIds
});

export default payments;

export const getAllPayments = state => {
  return state.get('allIds').map(id => state.get('byId').get(id));
};

export const getById = (state, id) => {
  return state.get('byId').get(id);
};
