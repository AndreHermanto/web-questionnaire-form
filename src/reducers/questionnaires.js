import { fromJS } from 'immutable';
import * as types from '../constants/ActionTypes';

const initialState = {
  items: fromJS({}),
  isError: false,
  isLoading: false,
  resume: false
};

export const getQuestionnaires = state => state.items;

const questionnaires = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_QUESTIONNAIRE_REQUEST:
    case types.FETCH_QUESTIONNAIRE_FAILURE:
      return state;
    case types.FETCH_QUESTIONNAIRE_SUCCESS: {
      const questionnaire = fromJS(action.payload);
      return {
        ...state,
        items: state.items.set(questionnaire.get('id'), questionnaire)
      };
    }
    case types.FETCH_QUESTIONNAIRES_REQUEST:
      return {
        ...state,
        isLoading: true
      };
    case types.FETCH_QUESTIONNAIRES_SUCCESS: {
      const questionnaires = fromJS(action.payload.questionnaires);
      return {
        ...state,
        isLoading: false,
        isError: false,
        items: questionnaires.reduce(
          (carry, questionnaire) =>
            carry.set(questionnaire.get('id'), questionnaire),
          state.items
        )
      };
    }
    case types.FETCH_QUESTIONNAIRES_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: true
      };
    case 'SET_SELECTED_QUESTIONNAIRE': {
      const questionnaire = fromJS(action.questionnaire);
      return {
        ...state,
        items: state.items.set(questionnaire.get('id'), questionnaire)
      };
    }
    case 'SET_RESPONSE':
      return {
        ...state,
        response: action.response
      };
    case 'SET_VERSION':
      return {
        ...state,
        version: action.version
      };
    case 'SET_RESUME':
      return {
        ...state,
        resume: action.resume
      };
    default:
      return state;
  }
};

export default questionnaires;
