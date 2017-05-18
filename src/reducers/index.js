/*
* example reducers with get questionnaires action
*/
export default function mainReducer(state = {}, action) {
  switch (action.type) {
    case 'ADD_QUESTIONNAIRES':
      return {
        ...state,
        questionnaires: action.payload
      };
    default:
      return state;
  }
}
