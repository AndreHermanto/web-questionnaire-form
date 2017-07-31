import { normalize } from 'normalizr';
import Immutable from 'immutable';
import { hashHistory } from 'react-router';
import cuid from 'cuid';
import * as types from '../constants/ActionTypes';
import * as api from '../api';
import * as schema from './schema';
import * as selectors from '../reducers';

export * from './consents';
export * from './security';
/*
*action: addQuestionnaires to the form builder
*/
export function fetchQuestionnairesSuccess(questionnaires) {
  return {
    type: 'FETCH_QUESTIONNAIRES_SUCCESS',
    payload: normalize(questionnaires, schema.arrayOfQuestionnaires)
  };
}

export const updateResponseOnServer = () => (dispatch, getState) => {
  const state = getState();
  const responseId = selectors.getResponseId(state);
  const fullResponse = selectors.getFullResponse(state);
  dispatch({
    type: types.UPDATE_RESPONSE_REQUEST
  });
  return api
    .updateResponse(responseId, fullResponse)
    .then(response => response.json())
    .then(json => json.data)
    .then(response => {
      dispatch({
        type: types.UPDATE_RESPONSE_SUCCESS,
        payload: normalize(response, schema.response)
      });
    });
};

export const setFollowUpResponse = (
  responseElementId,
  answerId,
  followUpText
) => (dispatch, getState) => {
  dispatch(updateFollowUpResponse(responseElementId, answerId, followUpText));
  dispatch(updateResponseOnServer());
};

export const updateFollowUpResponse = (
  responseElementId,
  answerId,
  followUpText
) => (dispatch, getState) => {
  const state = getState();
  const responseElementAnswer = selectors
    .getResponseElementAnswersById(state, answerId)
    .set('followUp', Immutable.fromJS({ text: followUpText }));
  dispatch({
    type: types.SET_FOLLOW_UP_RESPONSE,
    payload: normalize(
      responseElementAnswer.toJS(),
      schema.responseElementAnswer
    )
  });
};

export const markAsPreferNotToAnswer = responseElementId => (
  dispatch,
  getState
) => {
  const state = getState();
  const responseElement = selectors.getResponseElementById(
    state,
    responseElementId
  );
  dispatch({
    type: types.MARK_AS_PREFER_NOT_TO_ANSWER,
    payload: normalize(
      responseElement
        .set('preferNotToAnswer', !responseElement.get('preferNotToAnswer'))
        .set(
          'answers',
          !responseElement.get('preferNotToAnswer')
            ? Immutable.List()
            : responseElement.get('answers')
        )
        .toJS(),
      schema.responseElement
    )
  });
  dispatch(updateResponseOnServer());
};

export const checkForRepeats = (responseElementId, answerId) => (
  dispatch,
  getState
) => {
  // responseId is in UI
  const state = getState();
  const answer = selectors.getAnswerById(state, answerId);
  // does the answer have a goTo
  if (!answer.get('goTo')) {
    return;
  }

  const responseId = selectors.getResponseId(state);
  const response = selectors.getResponseById(state, responseId);
  // get respone elements for response
  const responseElementIds = response.get('answeredQuestions');
  const responseElements = responseElementIds.map(id => {
    return selectors.getResponseElementById(state, id);
  });
  // find the index of the response element id
  const repeatTo = responseElementIds.indexOf(responseElementId);
  const insertAfter = repeatTo;
  // okay, work out, what we needt to duplicate
  const repeatFrom = responseElements.findLastIndex(
    responseElement =>
      responseElement.get('elementId') === answer.get('goTo').get('id')
  );

  if (repeatFrom > repeatTo) {
    // its already been repeated
    // just dispatching so its easy to look at the logs
    // basically, if the last instance of the thing we are finding,
    // is after this question, it means, we have already repeated it
    dispatch({
      type: 'ALREADY_REPEATED'
    });
    return;
  }
  const responseElementsToAdd = responseElements
    .slice(repeatFrom, repeatTo + 1)
    .map(responseElement =>
      responseElement.set('id', cuid()).set('answers', Immutable.List())
    );

  const newResponse = response.update(
    'answeredQuestions',
    answeredQuestions => {
      return answeredQuestions
        .slice(0, insertAfter + 1)
        .concat(responseElementsToAdd)
        .concat(answeredQuestions.slice(insertAfter + 1));
    }
  );

  dispatch({
    type: types.REPEAT_SECTION,
    payload: normalize(newResponse.toJS(), schema.response)
  });
};

export const showSubmissionConfirmation = () => ({
  type: types.SHOW_SUBMISSION_CONFIRMATION
});
export const hideSubmissionConfirmation = () => ({
  type: types.HIDE_SUBMISSION_CONFIRMATION
});
export const submitResponse = (encryptedUserId, encryptedConsentTypeId) => (
  dispatch,
  getState
) => {
  const state = getState();
  const responseId = selectors.getResponseId(state);
  const userId = selectors.getUserId(state);
  const response = selectors
    .getResponseById(state, responseId)
    .set('completed', true);
  dispatch({
    type: types.SUBMIT_RESPONSE,
    payload: normalize(response.toJS(), schema.response)
  });
  return dispatch(updateResponseOnServer()).then(() => {
    hashHistory.push(
      `users/${encryptedUserId}/${encryptedConsentTypeId}/${responseId}/end`
    );
  });
};

export const selectAnswer = (responseElementId, answerId) => dispatch => {
  dispatch({
    type: 'SELECT_ANSWER',
    payload: normalize(
      {
        id: answerId
      },
      schema.responseElementAnswer
    ),
    responseElementId
  });
  dispatch(checkForRepeats(responseElementId, answerId));
  dispatch(updateResponseOnServer());
};
export const toggleAnswer = (responseElementId, answerId) => dispatch => {
  dispatch({
    type: 'TOGGLE_ANSWER',
    payload: normalize(
      {
        id: answerId
      },
      schema.responseElementAnswer
    ),
    responseElementId
  });
  dispatch(checkForRepeats(responseElementId, answerId));
  dispatch(updateResponseOnServer());
};
export const setAnswerValue = (
  responseElementId,
  answerId,
  valuePropertyName,
  value
) => (dispatch, getState) => {
  const state = getState();
  let responseElementAnswer;
  const existingResponseElementAnswer = selectors.getResponseElementAnswersById(
    state,
    answerId
  );
  if (existingResponseElementAnswer) {
    responseElementAnswer = existingResponseElementAnswer
      .set(valuePropertyName, value)
      .toJS();
  } else {
    responseElementAnswer = {
      id: answerId,
      [valuePropertyName]: value
    };
  }
  dispatch({
    type: 'SET_ANSWER_VALUE',
    payload: normalize(responseElementAnswer, schema.responseElementAnswer),
    responseElementId
  });
  dispatch(checkForRepeats(responseElementId, answerId));
  dispatch(updateResponseOnServer());
};

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
  return dispatch => {
    dispatch(fetchQuestionnairesRequest());
    return fetch(`${process.env.REACT_APP_BASE_URL}/questionnaires`)
      .then(res => res.json())
      .then(json => json.data)
      .then(questionnaires =>
        dispatch(fetchQuestionnairesSuccess(questionnaires))
      )
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

export function setResume(resume) {
  return {
    type: 'SET_RESUME',
    resume: resume
  };
}

export const fetchQuestionnaireRequest = () => ({
  type: types.FETCH_QUESTIONNAIRE_REQUEST
});
export const fetchQuestionnaireSuccess = questionnaire => ({
  type: types.FETCH_QUESTIONNAIRE_SUCCESS,
  payload: normalize(questionnaire, schema.questionnaire)
});
export const fetchQuestionnaireFailure = error => ({
  type: types.FETCH_QUESTIONNAIRE_FAILURE,
  error: true,
  playload: error
});
export const fetchQuestionnaire = questionnaireId => dispatch => {
  dispatch(fetchQuestionnaireRequest());
  return api
    .fetchQuestionnaire(questionnaireId)
    .then(response => response.json())
    .then(json => json.data)
    .then(questionnaire => {
      dispatch(fetchQuestionnaireSuccess(questionnaire));
      return questionnaire;
    })
    .catch(e => dispatch(fetchQuestionnaireFailure(e)));
};

// responses
export const fetchResponsesRequest = (questionnaireId, userId) => ({
  type: types.FETCH_RESPONSES_REQUEST,
  payload: { questionnaireId, userId }
});
export const fetchResponsesSuccess = responses => ({
  type: types.FETCH_RESPONSES_SUCCESS,
  payload: normalize(responses, schema.arrayOfResponses)
});
export const fetchResponsesFailure = error => ({
  type: types.FETCH_RESPONSES_FAILURE,
  error: true,
  playload: error
});
export const fetchResponses = (questionnaireId, userId) => dispatch => {
  dispatch(fetchResponsesRequest(questionnaireId, userId));
  return api
    .fetchResponses(questionnaireId, userId)
    .then(response => response.json())
    .then(json => json.data)
    .then(responses => {
      dispatch(fetchResponsesSuccess(responses));
      return responses;
    })
    .catch(e => dispatch(fetchResponsesFailure(e)));
};
// response
export const fetchResponse = responseId => (dispatch, getState) => {
  return api
    .fetchResponse(responseId)
    .then(response => response.json())
    .then(json => json.data)
    .then(response => {
      dispatch({
        type: types.FETCH_RESPONSE_SUCCESS,
        payload: normalize(response, schema.response)
      });
      return response;
    });
};

// create response
export const createResponseRequest = () => ({
  type: types.CREATE_RESPONSE_REQUEST
});
export const createResponseSuccess = response => ({
  type: types.CREATE_RESPONSE_SUCCESS,
  payload: normalize(response, schema.response)
});
export const createResponseFailure = error => ({
  type: types.CREATE_RESPONSE_FAILURE,
  error: true,
  playload: error
});

const createInitialResponse = (questionnaireId, userId, version) => {
  let sections = [];
  return {
    userId,
    questionnaireId,
    versionId: version.id,
    completed: false,
    answeredQuestions: version.body.map((element, index) => {
      if (element.type === 'section') {
        // remove all sections >= this section size
        // e.g. if this is a size 2, remove all the 2s and 3s
        sections = sections
          .filter(section => section.size < element.size)
          .concat([element]);
      }
      const logic = sections
        .map(
          section =>
            section.logic
              ? `(${section.logic.replace(/{(.*?)\//g, bits => '{/')})`
              : 'true'
        )
        .concat([
          element.logic
            ? `(${element.logic.replace(/{(.*?)\//g, bits => '{/')})`
            : 'true'
        ])
        .join(' && ');

      return {
        id: cuid(),
        elementId: element.id,
        viewed: false,
        answers: [],
        type: element.type,
        logic,
        visible: index === 0
      };
    })
  };
};

export const createResponse = (
  questionnaireId,
  userId,
  version
) => dispatch => {
  dispatch(createResponseRequest());
  const initialResponse = createInitialResponse(
    questionnaireId,
    userId,
    version
  );
  return api
    .createResponse(initialResponse)
    .then(response => response.json())
    .then(json => json.data)
    .then(response => {
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
  payload: normalize(version, schema.version)
});
export const fetchVersionFailure = error => ({
  type: types.FETCH_VERSION_FAILURE,
  error: true,
  playload: error
});
export const fetchVersion = (questionnaireId, versionId) => dispatch => {
  dispatch(fetchVersionRequest());
  return api
    .fetchVersion(questionnaireId, versionId)
    .then(response => response.json())
    .then(json => json.data)
    .then(version => {
      const realVersion = version;
      realVersion.body = JSON.parse(realVersion.body);
      dispatch(fetchVersionSuccess(realVersion));
      return realVersion;
    })
    .catch(e => dispatch(fetchVersionFailure(e)));
};

export const nextQuestion = () => ({
  type: types.NEXT_QUESTION
});
export const previousQuestion = () => ({
  type: types.PREVIOUS_QUESTION
});

export const resumeQuestionnaire = (
  { userId = null, versionId = null } = {}
) => ({
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
export const updateResponse = (responseId, response) => dispatch => {
  dispatch(updateResponseRequest());
  return api
    .updateResponse(responseId, response)
    .then(httpResponse => httpResponse.json())
    .then(json => json.data)
    .then(newResponse => {
      dispatch(updateResponseSuccess(newResponse));
      return newResponse;
    })
    .catch(e => dispatch(updateResponseFailure(e)));
};

export const setupQuestionnaire = ({ questionnaireId, resume }) => (
  dispatch,
  getState
) => {
  const state = getState();
  const userId = selectors.getUserId(state);
  // get the responses
  dispatch(fetchResponses(questionnaireId, userId))
    .then(responses => {
      if (responses.length) {
        const response = responses[responses.length - 1];
        // there are responses
        return dispatch(
          fetchVersion(questionnaireId, response.versionId)
        ).then(() => {
          dispatch({
            type: 'SET_CURRENT_QUESTIONNAIRE',
            payload: {
              responseId: response.id,
              versionId: response.versionId,
              userId: response.userId,
              questionnaireId
            }
          });
          return response;
        });
      }
      // no responses
      // find out what the current version is
      return dispatch(fetchQuestionnaire(questionnaireId))
        .then(questionnaire =>
          dispatch(
            fetchVersion(questionnaireId, questionnaire.currentVersionId)
          )
        )
        .then(version => {
          return dispatch(
            createResponse(questionnaireId, userId, version)
          ).then(response => {
            dispatch({
              type: 'SET_CURRENT_QUESTIONNAIRE',
              payload: {
                responseId: response.id,
                versionId: response.versionId,
                questionnaireId
              }
            });
            return response;
          });
        });
    })
    .then(() => {
      // resumse
      return dispatch(resumeQuestionnaire(userId));
    });
};

/*
* Set page debug mode
*/

export function setQuestionnaireDebug(debug) {
  return {
    type: 'SET_QUESTIONNAIRE_DEBUG',
    debug: debug
  };
}

export const setQuestionAnswer = ({ responseElement }) => (
  dispatch,
  getState
) => {
  const state = getState().responses;
  const index = state.items
    .getIn([state.currentId, 'answeredQuestions'])
    .findIndex(
      myResponseElement =>
        myResponseElement.get('id') === responseElement.get('id')
    );
  dispatch({
    type: types.SET_QUESTION_ANSWER,
    payload: { responseElement, index }
  });
  if (index === state.index && responseElement.get('type') === 'radio') {
    dispatch(nextQuestion());
  }
};

export const setMatrixQuestionAnswer = ({
  responseElementId,
  questionId,
  answerId,
  selected
}) => ({
  type: types.SET_MATRIX_QUESTION_ANSWER,
  payload: {
    responseElementId,
    questionId,
    answerId,
    selected
  }
});

export function setResponseSubmitted() {
  return {
    type: 'SUBMIT_RESPONSE'
  };
}
