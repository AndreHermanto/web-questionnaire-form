import { fromJS } from 'immutable';
import * as types from '../constants/ActionTypes';

const initialState = fromJS({
  isLoading: false,
  isResponseUpdating: false,
  isError: false,
  showPreferNotToAnswerModal: null
});

const uiResponses = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_RESPONSES_REQUEST:
      return state.set('isLoading', true).set('isError', false);
    case types.FETCH_RESPONSES_SUCCESS:
      return state.set('isLoading', false).set('isError', false);
    case types.FETCH_RESPONSES_FAILURE:
      return state.set('isLoading', false).set('isError', true);
    case types.UPDATE_RESPONSE_REQUEST:
      return state.set('isResponseUpdating', true);
    case types.SUBMIT_RESPONSE:
      return state.set('isLoading', true).set('isError', false);
    case types.UPDATE_RESPONSE_SUCCESS:
      return state
        .set('isLoading', false)
        .set('isError', false)
        .set('isResponseUpdating', false);
    case types.UPDATE_RESPONSE_FAILURE:
      return state
        .set('isLoading', false)
        .set('isResponseUpdating', false)
        .set('isError', true)
        .set('submitResponseFailure', action.payload);
    case types.OPEN_PREFER_NOT_TO_ANSWER_MODAL:
      return state.set('showPreferNotToAnswerModal', action.responseElementId);
    case types.CLOSE_PREFER_NOT_TO_ANSWER_MODAL:
      return state.set('showPreferNotToAnswerModal', null);
    default:
      return state;
  }
};

export default uiResponses;
