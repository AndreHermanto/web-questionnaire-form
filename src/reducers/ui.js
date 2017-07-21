import { fromJS, Map } from 'immutable';
import * as types from '../constants/ActionTypes';

const ui = (state = Map(), action) => {
  switch (action.type) {
    case 'SET_CURRENT_QUESTIONNAIRE':
      return state.merge(fromJS(action.payload));
    case types.SHOW_SUBMISSION_CONFIRMATION:
      return state.set('isShowingSubmissionConfirmation', true);
    case types.HIDE_SUBMISSION_CONFIRMATION:
    case types.SUBMIT_RESPONSE:
      return state.set('isShowingSubmissionConfirmation', false);
    default:
      return state;
  }
};

export default ui;
