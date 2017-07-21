import { combineReducers } from 'redux-immutable';
import { fromJS, List } from 'immutable';
import * as types from '../constants/ActionTypes';
import { dedup } from '../helpers';
import get from 'lodash.get';

const byId = (state = fromJS({}), action) => {
  if (get(action, 'payload.entities.responseElements', false)) {
    return state.merge(fromJS(action.payload.entities.responseElements));
  }

  switch (action.type) {
    case 'TOGGLE_ANSWER':
      return state.updateIn(
        [action.responseElementId, 'answers'],
        answerIds => {
          // see if its there
          const index = answerIds.findIndex(
            answerId => answerId === action.payload.result
          );
          // remove it
          if (index >= 0) {
            return answerIds.splice(index, 1);
          }
          // add it
          return answerIds.push(action.payload.result);
        }
      );
    case 'SELECT_ANSWER':
    case 'SET_ANSWER_VALUE':
      return state.setIn(
        [action.responseElementId, 'answers'],
        fromJS([action.payload.result])
      );
    default:
      return state;
  }
};

const allIds = (state = List(), action) => {
  switch (action.type) {
    case types.REPEAT_SECTION:
    case types.FETCH_RESPONSE_SUCCESS:
    case types.FETCH_RESPONSES_SUCCESS: {
      if (!action.payload.entities.responseElements) {
        return state;
      }
      return dedup(
        state.concat(Object.keys(action.payload.entities.responseElements))
      );
    }
    default:
      return state;
  }
};

const responseElements = combineReducers({
  byId,
  allIds
});

export default responseElements;

export const getAllResponseElements = state => {
  return state.get('allIds').map(id => state.get('byId').get(id));
};
export const getById = (state, id) => {
  return state.get('byId').get(id);
};
