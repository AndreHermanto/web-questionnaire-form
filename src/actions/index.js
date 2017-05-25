import cuid from 'cuid';
import * as types from '../constants/ActionTypes';
import * as api from '../api';

/*
*action: addQuestionnaires to the form builder
*/
export function fetchQuestionnairesSuccess(questionnaires) {
  return {
    type: 'FETCH_QUESTIONNAIRES_SUCCESS',
    payload: { questionnaires }
  };
}

/*
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
    dispatch(fetchQuestionnairesRequest());
    return fetch(`${process.env.REACT_APP_BASE_URL}/questionnaires`)
      .then(res => res.json())
      .then(json => json.data)
      .then(questionnaires => dispatch(fetchQuestionnairesSuccess(questionnaires)))
      .catch(ex => dispatch(fetchQuestionnairesFailure(ex)));
  };
}

/*
* add user response
*/

export function setSelectedQuestionnaire(questionnaire) {
  return {
    type: 'SET_SELECTED_QUESTIONNAIRE',
    questionnaire
  };
}

export function setResponse(response) {
  return {
    type: 'SET_RESPONSE',
    response
  };
}

export function setVersion(version) {
  return {
    type: 'SET_VERSION',
    version
  };
}

export const fetchQuestionnaireRequest = () => ({
  type: types.FETCH_QUESTIONNAIRE_REQUEST
});
export const fetchQuestionnaireSuccess = questionnaire => ({
  type: types.FETCH_QUESTIONNAIRE_SUCCESS,
  payload: questionnaire
});
export const fetchQuestionnaireFailure = error => ({
  type: types.FETCH_QUESTIONNAIRE_FAILURE,
  error: true,
  playload: error
});
export const fetchQuestionnaire = questionnaireId => (dispatch) => {
  dispatch(fetchQuestionnaireRequest());
  return api.fetchQuestionnaire(questionnaireId)
    .then(response => response.json())
    .then(json => json.data)
    .then((questionnaire) => {
      dispatch(fetchQuestionnaireSuccess(questionnaire));
      return questionnaire;
    })
    .catch(e => dispatch(fetchQuestionnaireFailure(e)));
};

// responses
export const fetchResponsesRequest = () => ({
  type: types.FETCH_RESPONSES_REQUEST
});
export const fetchResponsesSuccess = responses => ({
  type: types.FETCH_RESPONSES_SUCCESS,
  payload: { responses }
});
export const fetchResponsesFailure = error => ({
  type: types.FETCH_RESPONSES_FAILURE,
  error: true,
  playload: error
});
export const fetchResponses = (questionnaireId, userId) => (dispatch) => {
  dispatch(fetchResponsesRequest());
  return api.fetchResponses(questionnaireId, userId)
    .then(response => response.json())
    .then(json => json.data)
    .then((responses) => {
      dispatch(fetchResponsesSuccess(responses));
      return responses;
    })
    .catch(e => dispatch(fetchResponsesFailure(e)));
};

// create response
export const createResponseRequest = () => ({
  type: types.CREATE_RESPONSE_REQUEST
});
export const createResponseSuccess = response => ({
  type: types.CREATE_RESPONSE_SUCCESS,
  payload: response
});
export const createResponseFailure = error => ({
  type: types.CREATE_RESPONSE_FAILURE,
  error: true,
  playload: error
});
export const createResponse = (questionnaireId, userId, version) => (dispatch) => {
  dispatch(createResponseRequest());
  const initialResponse = {
    userId,
    questionnaireId,
    versionId: version.id,
    completed: false,
    answeredQuestions: version.body.map(element => ({
      id: cuid(),
      elementId: element.id,
      viewed: false,
      answers: []
    }))
  };
  return api.createResponse(initialResponse)
    .then(response => response.json())
    .then(json => json.data)
    .then((response) => {
      dispatch(createResponseSuccess(response));
      return response;
    })
    .catch(e => dispatch(createResponseFailure(e)));
};

// fetch one response
export const fetchVersionRequest = () => ({
  type: types.FETCH_VERSION_REQUEST
});
export const fetchVersionSuccess = version => ({
  type: types.FETCH_VERSION_SUCCESS,
  payload: { version }
});
export const fetchVersionFailure = error => ({
  type: types.FETCH_VERSION_FAILURE,
  error: true,
  playload: error
});
export const fetchVersion = (questionnaireId, versionId) => (dispatch) => {
  dispatch(fetchVersionRequest());
  return api.fetchVersion(questionnaireId, versionId)
    .then(response => response.json())
    .then(json => json.data)
    .then((version) => {
      const realVersion = version;
      realVersion.body = JSON.parse(realVersion.body);
      dispatch(fetchVersionSuccess(realVersion));
      return realVersion;
    })
    .catch(e => dispatch(fetchVersionFailure(e)));
};

export const nextQuestion = ({ element }) => ({
  type: types.NEXT_QUESTION,
  payload: { element }
});
export const previousQuestion = () => ({
  type: types.PREVIOUS_QUESTION
});

export const resumeQuestionnaire = ({ userId = null, versionId = null} = {}) => ({
  type: types.RESUME_QUESTIONNAIRE,
  payload: {
    userId,
    versionId
  }
});

// update a response
export const updateResponseRequest = () => ({
  type: types.UPDATE_RESPONSE_REQUEST
});
export const updateResponseSuccess = response => ({
  type: types.UPDATE_RESPONSE_SUCCESS,
  payload: response
});
export const updateResponseFailure = error => ({
  type: types.UPDATE_RESPONSE_FAILURE,
  error: true,
  playload: error
});
export const updateResponse = (responseId, response) => (dispatch) => {
  dispatch(updateResponseRequest());
  return api.updateResponse(responseId, response)
    .then(httpResponse => httpResponse.json())
    .then(json => json.data)
    .then((newResponse) => {
      dispatch(updateResponseSuccess(newResponse));
      return newResponse;
    })
    .catch(e => dispatch(updateResponseFailure(e)));
};



export const setupQuestionnaire = ({ questionnaireId, userId }) => (dispatch, getState) => {
  // get the responses
  dispatch(fetchResponses(questionnaireId, userId))
    .then((responses) => {
      if (responses.length) {
        const response = responses[0];
        // there are responses
        return dispatch(fetchVersion(questionnaireId, response.versionId)).then(() => response);
      }
      // no responses
      // find out what the current version is
      return dispatch(fetchQuestionnaire(questionnaireId))
        .then(questionnaire =>
          dispatch(fetchVersion(questionnaireId, questionnaire.currentVersionId)))
        .then(version =>
          dispatch(createResponse(questionnaireId, userId, version)));
    })
    .then(() => {
      // resumse
      return dispatch(resumeQuestionnaire(userId));
    });
}


/*
* Set page debug mode
*/

export function setQuestionnaireDebug(debug) {
  return {
    type: 'SET_QUESTIONNAIRE_DEBUG',
    debug: debug
  };
}