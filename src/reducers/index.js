import { combineReducers } from 'redux';
import { List } from 'immutable';
import questionnaires, * as fromQuestionnaires from './questionnaires';
import versions, * as fromVersions from './versions';
import responses, * as fromResponses from './responses';
import consentTypeMappings, * as fromConsentTypeMappings
  from './consentTypeMappings';

export default combineReducers({
  questionnaires,
  versions,
  responses,
  consentTypeMappings,
  debug: (state = { value: true }, action) => {
    switch (action.type) {
      case 'SET_QUESTIONNAIRE_DEBUG':
        return { ...state, value: action.debug };
      default:
        return state;
    }
  }
});

export const isFirstQuestion = state =>
  fromResponses.isFirstQuestion(state.responses);

export const isLastQuestion = state => {
  if (
    !fromResponses.getCurrentResponse(state.responses) ||
    !fromVersions.getCurrentVersion(state.versions)
  ) {
    return false;
  }
  return fromResponses.isLastQuestion(state.responses);
};

export const getQuestionnaires = state =>
  fromQuestionnaires.getQuestionnaires(state.questionnaires);

export const getVisibleQuestions = state =>
  fromResponses
    .getVisibleResponseElements(state.responses)
    .map(responseElement => {
      const element = fromVersions.getById(
        state.versions,
        responseElement.get('elementId')
      );
      return {
        element,
        responseElement
      };
    });

export const getEndPage = state => fromVersions.getEndPage(state.versions);

export const getAnsweredQuestions = state =>
  fromResponses.getAnsweredResponseElements(state.responses);

export const getQuestions = state =>
  fromResponses.getQuestionsElements(state.responses);

export const getCurrentVersion = state =>
  fromVersions.getCurrentVersion(state.versions);
export const getCurrentResponse = state =>
  fromResponses.getCurrentResponse(state.responses);

export const getDebug = state => {
  return state.debug.value;
};

export const getStuff = (state, consentTypeId, userId) => {
  const consentTypeMapping = fromConsentTypeMappings.getByConsentTypeId(
    state.consentTypeMappings,
    consentTypeId
  );
  if (!consentTypeMapping) {
    return List();
  }

  return consentTypeMapping.get('questionnaires').map(mappedQuestionnaire => {
    // get the version for that questionnaire
    const responses = fromResponses.getForQuestionnaireAndUser(
      state.responses,
      mappedQuestionnaire.get('questionnaireId'),
      userId
    );
    if (responses.size) {
      // there are responses...do something with that
      const firstResponse = responses.first();
      console.log('firstResponse', firstResponse);
      const version = fromVersions.getVersionById(
        state.versions,
        firstResponse.get('versionId')
      );
      if (!version) {
        return undefined;
      }
      return version.set('response', firstResponse);
    } else {
      // there are no responses, use the version id from the mapping
      const version = fromVersions.getVersionById(
        state.versions,
        mappedQuestionnaire.get('versionPublished')
      );
      console.log(
        'version is',
        version,
        state.versions,
        mappedQuestionnaire.get('versionPublished')
      );
      return version;
    }
  });
};
