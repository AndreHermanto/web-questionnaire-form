import { combineReducers } from 'redux-immutable';
import { fromJS, List } from 'immutable';
import * as types from '../constants/pricePlansMappingTypes';
import { dedup } from '../helpers';

const byId = (state = fromJS({}), action) => {
  switch (action.type) {
    case types.FETCH_PRICEPLANSMAPPING_SUCCESS:
      return state.merge(fromJS(action.payload.entities.pricePlansMapping));
    case types.CREATE_PRICEPLANSMAPPING_SUCCESS:
      return state.merge(fromJS(action.payload.entities.pricePlansMapping));
    case types.UPDATE_PRICEPLANSMAPPING_SUCCESS:
      return state.merge(fromJS(action.payload.entities.pricePlansMapping));
    case types.DELETE_PRICEPLANSMAPPING_SUCCESS:
      return state.delete(action.id);
    default:
      return state;
  }
};

const allIds = (state = List(), action) => {
  switch (action.type) {
    case types.FETCH_PRICEPLANSMAPPING_SUCCESS:
      return dedup(state.concat(fromJS(action.payload.result)));
    case types.CREATE_PRICEPLANSMAPPING_SUCCESS:
      return dedup(state.concat(fromJS(action.payload.result)));
    case types.DELETE_PRICEPLANSMAPPING_SUCCESS:
      return state.filter(id => action.id !== id);
    default:
      return state;
  }
};

const pricePlansMapping = combineReducers({
  byId,
  allIds
});

export default pricePlansMapping;

export const getAllPricePlansMapping = state => {
  return state.get('allIds').map(id => state.get('byId').get(id + ''));
};
export const getById = (state, id) => {
  return state.get('byId').get(id + '');
};
