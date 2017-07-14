import { normalize } from 'normalizr';
import * as schema from './schema';
import * as types from '../constants/ConsentTypes';
import * as api from '../api';
import { List } from 'immutable';
import { fetchResponses, fetchVersion } from './index';

export const fetchConsentTypeMappingRequest = () => ({
  type: types.FETCH_CONSENT_TYPE_MAPPINGS_REQUEST
});

export const fetchConsentTypeMappingsSuccess = ({ payload }) => ({
  type: types.FETCH_CONSENT_TYPE_MAPPINGS_SUCCESS,
  payload
});

export const fetchConsentTypeMappingsFailure = ({ payload }) => ({
  type: types.FETCH_CONSENT_TYPE_MAPPINGS_FAILURE,
  payload
});

export const fetchConsentTypeMappings = consentTypeId => async dispatch => {
  dispatch(fetchConsentTypeMappingRequest());
  const response = await api.getConsentTypeMappings(consentTypeId);
  const json = await response.json();
  dispatch(
    fetchConsentTypeMappingsSuccess({
      payload: normalize(json.data, schema.arrayOfConsentTypeMappings)
    })
  );
  return json.data;
};

export const fetchDataForHomepage = (consentTypeId, userId) => (
  dispatch,
  getState
) => {
  dispatch(fetchConsentTypeMappings(consentTypeId)).then(() => {
    const state = getState();
    // get out all the questionnaires for the consent types
    // TODO: change to a selector
    const mappedQuestionnaires = state.consentTypeMappings
      .get('byId')
      .toSeq()
      .reduce(
        (acc, consentTypeMapping) =>
          acc.concat(consentTypeMapping.get('questionnaires')),
        List()
      );
    // now, with the questionnaire ids, load the responses
    mappedQuestionnaires.forEach(mappedQuestionnaires => {
      dispatch(
        fetchResponses(mappedQuestionnaires.get('questionnaireId'), userId)
      ).then(responses => {
        if (responses.length) {
          dispatch(
            fetchVersion(
              mappedQuestionnaires.get('questionnaireId'),
              responses[0].versionId
            )
          );
        } else {
          dispatch(
            fetchVersion(
              mappedQuestionnaires.get('questionnaireId'),
              mappedQuestionnaires.get('versionPublished')
            )
          );
        }
      });
    });
  });
};
