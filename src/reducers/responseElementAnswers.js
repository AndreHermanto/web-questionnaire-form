import { combineReducers } from 'redux-immutable';
import get from 'lodash.get';
import { fromJS, List } from 'immutable';
import * as types from '../constants/ActionTypes';
import { dedup } from '../helpers';

const byId = (state = fromJS({}), action) => {
  if (get(action, 'payload.entities.responseElementAnswers', false)) {
    return state.merge(fromJS(action.payload.entities.responseElementAnswers));
  }
  return state;
};

const allIds = (state = List(), action) => {
  switch (action.type) {
    case 'TOGGLE_ANSWER':
    case 'SELECT_ANSWER':
    case 'SET_ANSWER_VALUE':
      return dedup(state.concat(action.payload.result));
    case types.FETCH_RESPONSE_SUCCESS:
    case types.FETCH_RESPONSES_SUCCESS: {
      if (!get(action, 'payload.entities.responseElementAnswers', null)) {
        return state;
      }
      return dedup(
        state.concat(
          Object.keys(action.payload.entities.responseElementAnswers)
        )
      );
    }
    default:
      return state;
  }
};

const responseElementAnswers = combineReducers({
  byId,
  allIds
});

export default responseElementAnswers;

export const getAllResponseElementAnswers = state => {
  return state.get('allIds').map(id => state.get('byId').get(id));
};
export const getById = (state, id) => {
  return state.get('byId').get(id);
};
