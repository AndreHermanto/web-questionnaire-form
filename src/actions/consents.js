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

export const fetchConsentTypeMappings = consentTypeId => (
  dispatch,
  getState
) => {
  dispatch(fetchConsentTypeMappingRequest());
  return api
    .getConsentTypeMappings(consentTypeId)
    .then(response => response.json())
    .then(json => json.data)
    .then(consentTypeMappings => {
      dispatch(
        fetchConsentTypeMappingsSuccess({
          payload: normalize(
            consentTypeMappings,
            schema.arrayOfConsentTypeMappings
          )
        })
      );
      return consentTypeMappings;
    });
};

export const fetchDataForHomepage = (consentTypeId, userId) => (
  dispatch,
  getState
) => {
  return dispatch(fetchConsentTypeMappings(consentTypeId)).then(() => {
    const state = getState();

    // get out all the questionnaires for the consent types
    // TODO: change to a selector
    const mappedQuestionnaires = state
      .get('entities')
      .get('consentTypeMappings')
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
