import { fromJS, Map } from 'immutable';
import * as types from '../constants/ActionTypes';
import * as securityTypes from '../constants/SecurityTypes';

const ui = (state = Map(), action) => {
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
    case types.INIT_LARGE_TEXT:
      return state.set('largeText', false);
    case types.SET_LARGE_TEXT:
      return state.set('largeText', !state.get('largeText'));
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
