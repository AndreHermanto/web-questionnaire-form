import { fromJS } from 'immutable';
import * as types from '../constants/ConsentTypes';

const initialState = fromJS({
  isLoading: false,
  isError: false,
  selectedConsentType: {}
});

const landingPage = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_LANDING_PAGE_REQUEST:
      return state.set('isLoading', true).set('isError', false);
    case types.FETCH_LANDING_PAGE_FAILURE:
      return state
        .set('isLoading', false)
        .set('isError', true)
        .set('selectedConsentType', {});
    case types.FETCH_LANDING_PAGE_SUCCESS:
      return state
        .set('isLoading', false)
        .set('isError', false)
        .set('selectedConsentType', action.payload);
    default:
      return state;
  }
};

export default landingPage;
