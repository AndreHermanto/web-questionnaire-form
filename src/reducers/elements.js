import { combineReducers } from 'redux-immutable';
import { fromJS, List } from 'immutable';
import * as types from '../constants/ActionTypes';
import { dedup } from '../helpers';

const byId = (state = fromJS({}), action) => {
  switch (action.type) {
    case types.FETCH_VERSION_SUCCESS:
      return state.merge(
        fromJS(
          action.payload.entities.elements
            ? action.payload.entities.elements
            : {}
        )
      );
    default:
      return state;
  }
};

const allIds = (state = List(), action) => {
  switch (action.type) {
    case types.FETCH_VERSION_SUCCESS:
      return dedup(
        state.concat(
          Object.keys(
            action.payload.entities.elements
              ? action.payload.entities.elements
              : {}
          )
        )
      );
    default:
      return state;
  }
};

const elements = combineReducers({
  byId,
  allIds
});

export default elements;

export const getAllElements = state => {
  return state.get('allIds').map(id => state.get('byId').get(id + ''));
};
export const getById = (state, id) => {
  return state.get('byId').get(id + '');
};
