import { combineReducers } from 'redux';
import questionnaires, * as fromQuestionnaires from './questionnaires';
import versions, * as fromVersions from './versions';
import responses,* as fromResponses from './responses';

export default combineReducers({
  questionnaires,
  versions,
  responses,
  debug: (state = { debug: true }, action) => {
    switch (action.type) {
      case 'SET_QUESTIONNAIRE_DEBUG':
        return { ...state, debug: action.debug };
      default:
        return state;
    }
  }
});

export const isFirstQuestion = state => fromResponses.isFirstQuestion(state.responses);

export const isLastQuestion = state => {
  if (!fromResponses.getCurrentResponse(state.responses) ||
    !fromVersions.getCurrentVersion(state.versions)) {
    return false;
  }
  return fromResponses.isLastQuestion(state.responses);
}

export const getQuestionnaires = state =>
  fromQuestionnaires.getQuestionnaires(state.questionnaires);

export const getVisibleQuestions = state =>
  fromResponses.getVisibleResponseElements(state.responses)
    .map(responseElement => {
      const element = fromVersions.getById(state.versions, responseElement.get('elementId'));
      return {
        element,
        responseElement
      }
    });

export const getCurrentVersion = state =>
  fromVersions.getCurrentVersion(state.versions);
export const getCurrentResponse = state =>
  fromResponses.getCurrentResponse(state.responses);
