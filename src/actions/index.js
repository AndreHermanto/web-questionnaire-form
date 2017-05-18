/*
*action: addQuestionnaires to the form builder
*/
export function fetchQuestionnairesSuccess(questionnaires) {
  return {
    type: 'FETCH_QUESTIONNAIRES_SUCCESS',
    payload: questionnaires
  };
}

/*
<<<<<<< HEAD
*async action: fetch all questionnaires
*/
function fetchQuestionnairesRequest() {
  return {
    type: 'FETCH_QUESTIONNAIRES_REQUEST'
  };
}

function fetchQuestionnairesFailure(ex) {
  return {
    type: 'FETCH_QUESTIONNAIRES_FAILURE',
    ex
  };
}

export function fetchQuestionnaires() {
  return (dispatch) => {
    dispatch(fetchQuestionnairesRequest())
    return fetch(`${process.env.REACT_APP_BASE_URL}/questionnaires`)
      .then(res => res.json())
      .then(json => json.data)
      .then(questionnaires => dispatch(fetchQuestionnairesSuccess(questionnaires)))
      .catch(ex => dispatch(fetchQuestionnairesFailure(ex)));
  }
}


/*
* add user response 
*/
export function setResponse(response) {
  return {
    type: 'SET_RESPONSE',
    response: response
  };
}

export function setVersion(version) {
  return {
    type: 'SET_VERSION',
    version: version
  }
}