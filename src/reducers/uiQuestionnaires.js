import { fromJS } from 'immutable';
import * as types from '../constants/ActionTypes';

const initialState = fromJS({
  isLoading: false,
  isError: false
});

const uiQuestionnaires = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_QUESTIONNAIRES_REQUEST:
      return state.set('isLoading', true).set('isError', false);
    case types.FETCH_QUESTIONNAIRES_SUCCESS:
      return state.set('isLoading', false).set('isError', false);
    case types.FETCH_QUESTIONNAIRES_FAILURE:
      return state.set('isLoading', false).set('isError', true);
    default:
      return state;
  }
};

export default uiQuestionnaires;
