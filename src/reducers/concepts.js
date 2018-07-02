import { combineReducers } from 'redux-immutable';
import { fromJS, List } from 'immutable';
import * as types from '../constants/ConceptTypes';
import { dedup } from '../helpers';

const byId = (state = fromJS({}), action) => {
  switch (action.type) {
    case types.FETCH_CONCEPTS_SUCCESS:
      return state.merge(
        fromJS(
          action.payload.entities.concepts
            ? action.payload.entities.concepts
            : {}
        )
      );
    default:
      return state;
  }
};

const allIds = (state = List(), action) => {
  switch (action.type) {
    case types.FETCH_CONCEPTS_SUCCESS:
      return dedup(
        state.concat(
          Object.keys(
            action.payload.entities.concepts
              ? action.payload.entities.concepts
              : {}
          )
        )
      );
    default:
      return state;
  }
};

const concepts = combineReducers({
  byId,
  allIds
});

export default concepts;

export const getAllConcepts = state => {
  return state.get('allIds').map(id => state.get('byId').get(id + ''));
};
export const getById = (state, id) => {
  return state.get('byId').get(id + '');
};
