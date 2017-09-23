import { normalize } from 'normalizr';
import * as schema from './schema';
import * as types from '../constants/ConsentTypes';
import * as api from '../api';
import { List } from 'immutable';
import { fetchResponses, fetchVersion } from './index';

export const fetchReleasesRequest = () => ({
  type: types.FETCH_RELEASES_REQUEST
});

export const fetchReleasesSuccess = ({ payload }) => ({
  type: types.FETCH_RELEASES_SUCCESS,
  payload
});

export const fetchReleasesFailure = ({ payload }) => ({
  type: types.FETCH_RELEASES_FAILURE,
  payload
});

export const fetchReleases = consentTypeId => (dispatch, getState) => {
  dispatch(fetchReleasesRequest());
  return api
    .getReleases(consentTypeId)
    .then(response => response.json())
    .then(json => json.data)
    .then(releases => {
      dispatch(
        fetchReleasesSuccess({
          payload: normalize(
            releases[Math.max(0, releases.length - 1)],
            schema.releases
          )
        })
      );
      return releases;
    })
    .catch(ex => dispatch(fetchReleasesFailure(ex)));
};

export const fetchDataForHomepage = () => (dispatch, getState) => {
  const state = getState();
  const consentTypeId = state.get('ui').get('consentTypeId');
  const userId = state.get('ui').get('userId');
  return dispatch(fetchReleases(consentTypeId)).then(() => {
    const state = getState();

    // get out all the questionnaires for the consent types
    // TODO: change to a selector
    const mappedQuestionnaires = state
      .get('entities')
      .get('releases')
      .get('byId')
      .toSeq()
      .reduce(
        (acc, release) => acc.concat(release.get('questionnaires')),
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
