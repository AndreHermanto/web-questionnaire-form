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
function fetchQuestionnairesRequest() {
  return {
    type: 'FETCH_QUESTIONNAIRES_REQUEST'
  }
}

function fetchQuestionnairesFailure(ex) {
  return {
    type: 'FETCH_QUESTIONNAIRES_FAILURE',
    ex
  }
}

export function fetchQuestionnaires() {
  return dispatch => {
    dispatch(fetchQuestionnairesRequest())
    return fetch(`${process.env.REACT_APP_BASE_URL}/questionnaires`)
      .then(res => res.json())
      .then(json => json.data)
      .then(questionnaires => dispatch(addQuestionnaires(questionnaires)))
      .catch(ex => dispatch(fetchQuestionnairesFailure(ex)))
  }
}