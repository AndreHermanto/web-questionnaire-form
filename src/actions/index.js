/*
*action: addQuestionnaires to the form builder
*/
export function addQuestionnaires(questionnaires) {
  return {
    type: 'ADD_QUESTIONNAIRES',
    payload: questionnaires
  };
}

/*
*async action: fetch all questionnaires
*/
function fetchTodosRequest() {
  return {
    type: 'FETCH_TODOS_REQUEST'
  }
}

function fetchTodosFailure(ex) {
  return {
    type: 'FETCH_TODOS_FAILURE',
    ex
  }
}

export function fetchQuestionnaires() {
  return dispatch => {
    dispatch(fetchTodosRequest())
    return fetch(`${process.env.REACT_APP_BASE_URL}/questionnaires`)
      .then(res => res.json())
      .then(json => json.data)
      .then(questionnaires => dispatch(addQuestionnaires(questionnaires)))
      .catch(ex => dispatch(fetchTodosFailure(ex)))
  }
}