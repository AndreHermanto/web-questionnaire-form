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

export const isShowingSubmit = state => {
  const currentResponse = fromResponses
    .getCurrentResponse(state.responses);
  if (!currentResponse) {
    return false;
  }
  return state.responses.index ===
    currentResponse
    .get('answeredQuestions')
    .size - 1;
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

export const getCurrentResponse = state =>
  fromResponses.getCurrentResponse(state.responses);
