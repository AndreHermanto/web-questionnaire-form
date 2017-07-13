import { combineReducers } from 'redux-immutable';
import { fromJS, List } from 'immutable';
import * as types from '../constants/ConsentTypes';
import { dedup } from '../helpers';

const byId = (state = fromJS({}), action) => {
  switch (action.type) {
    case types.FETCH_CONSENT_TYPE_MAPPINGS_SUCCESS:
      return state.merge(fromJS(action.payload.entities.consentTypeMappings));
    default:
      return state;
  }
};

const allIds = (state = List(), action) => {
  switch (action.type) {
    case types.FETCH_CONSENT_TYPE_MAPPINGS_SUCCESS:
      return dedup(state.concat(fromJS(action.payload.result)));
    default:
      return state;
  }
};

const consentTypeMappings = combineReducers({
  byId,
  allIds
});
export default consentTypeMappings;

export const getAllConsentTypeMappings = state => {
  return state.get('allIds').map(id => state.get('byId').get(id));
};

export const getByConsentTypeId = (state, consentTypeId) => {
  return state
    .get('byId')
    .find(
      consentTypeMapping =>
        consentTypeMapping.get('consentTypeId') === consentTypeId
    );
};
