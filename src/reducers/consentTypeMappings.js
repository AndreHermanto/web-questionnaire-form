import { combineReducers } from 'redux-immutable';
import { fromJS, List } from 'immutable';
import * as types from '../constants/ConsentTypes';
import { dedup } from '../helpers';
import get from 'lodash.get';

const byId = (state = fromJS({}), action) => {
  if (get(action, 'payload.entities.consentTypeMappings', false)) {
    return state.merge(fromJS(action.payload.entities.consentTypeMappings));
  }
  return state;
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
  console.log(state, consentTypeId);
  return state
    .get('byId')
    .find(
      consentTypeMapping =>
        String(consentTypeMapping.get('consentTypeId')) === consentTypeId
    );
};
