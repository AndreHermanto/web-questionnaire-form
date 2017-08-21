import { fromJS, Map } from 'immutable';
import * as types from '../constants/ActionTypes';
import * as securityTypes from '../constants/SecurityTypes';

const ui = (state = Map({ largeText: 0 }), action) => {
  switch (action.type) {
    case securityTypes.DECRYPT_TOKENS_FAILURE:
      return state.set('failedToDecrypt', true);
    case securityTypes.DECRYPT_TOKENS_SUCCESS:
      return state.set('failedToDecrypt', false).merge(fromJS(action.payload));
    case 'SET_CURRENT_QUESTIONNAIRE':
      return state.merge(fromJS(action.payload));
    case types.SHOW_SUBMISSION_CONFIRMATION:
      return state.set('isShowingSubmissionConfirmation', true);
    case types.HIDE_SUBMISSION_CONFIRMATION:
    case types.SUBMIT_RESPONSE:
      return state.set('isShowingSubmissionConfirmation', false);
    case 'SUBMIT_RESPONSE_REQUEST':
      return state.set('isSubmittingResponse', true);
    case 'SUBMIT_RESPONSE_SUCCESS':
      return state.set('isSubmittingResponse', false);
    case 'SUBMIT_RESPONSE_FAILURE':
      return state
        .set('isSubmittingResponse', false)
        .set('submitResponseFailure', action.payload.response);
    case types.CYCLE_FONT_SIZE:
      return state.set('largeText', action.fontSize);
    default:
      return state;
  }
};

export default ui;

export const getFailedToDecrypt = state => {
  return state.get('failedToDecrypt');
};

export const getLargeText = state => {
  return state.get('largeText');
};
