/*
* example reducers with get questionnaires action
*/
export default function mainReducer(state = {}, action) {
  switch (action.type) {
    case 'GET_QUESTIONNAIRES':
      return action.data;
    default:
      return state;
  }
}