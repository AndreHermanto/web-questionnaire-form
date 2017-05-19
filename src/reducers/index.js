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
    default:
      return state;
  }
}
