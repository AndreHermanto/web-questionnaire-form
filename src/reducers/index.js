/*
* example reducers with get questionnaires action
*/
export default function mainReducer(state = {}, action) {
  switch (action.type) {
    case 'FETCH_QUESTIONNAIRES_REQUEST':
      return {
        ...state,
        isLoading: true
      };
    case 'FETCH_QUESTIONNAIRES_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        questionnaires: action.payload
      };
    case 'FETCH_QUESTIONNAIRES_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true
      };
    case 'SET_SELECTED_QUESTIONNAIRE':
      return {
        ...state,
        questionnaire: action.questionnaire
      };
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
    case 'SET_QUESTIONNAIRE_DEBUG':
      return {
        ...state,
        debug: action.debug
      }
    default:
      return state;
  }
}
