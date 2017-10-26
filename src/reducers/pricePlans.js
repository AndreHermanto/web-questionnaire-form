import { combineReducers } from 'redux-immutable';
import { fromJS, List } from 'immutable';
import * as types from '../constants/pricePlanTypes';
import { dedup } from '../helpers';

const byId = (state = fromJS({}), action) => {
  switch (action.type) {
    case types.FETCH_PRICEPLANS_SUCCESS:
      return state.merge(fromJS(action.payload.entities.pricePlans));
    default:
      return state;
  }
};

const allIds = (state = List(), action) => {
  switch (action.type) {
    case types.FETCH_PRICEPLANS_SUCCESS:
      return dedup(state.concat(fromJS(action.payload.result)));
    default:
      return state;
  }
};

const pricePlans = combineReducers({
  byId,
  allIds
});

export default pricePlans;

export const getAllPricePlans = state => {
  return state.get('allIds').map(id => state.get('byId').get(id));
};

export const getPricePlansMap = state => {
  return state.get('byId');
};

export const getById = (state, id) => {
  return state.get('byId').get(id);
};
