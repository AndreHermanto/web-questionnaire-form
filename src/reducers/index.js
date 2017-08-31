import { combineReducers } from 'redux-immutable';
import { List } from 'immutable';
import moment from 'moment';
import * as fromQuestionnaires from './questionnaires';
import * as fromVersions from './versions';
import * as fromResponses from './responses';
import * as fromElements from './elements';
import * as fromResponseElements from '././responseElements';
import * as fromResponseElementAnswers from './responseElementAnswers';
import * as fromAnswers from './answers';
import ui, * as fromUI from './ui';
import uiQuestionnaires from './uiQuestionnaires';
import uiResponses from './uiResponses';
import * as fromConsentTypeMappings from './consentTypeMappings';
import entities from './entities';
import questionTypes from '../constants/QuestionTypes';

export default combineReducers({
  debug: (state = { value: true }, action) => {
    switch (action.type) {
      case 'SET_QUESTIONNAIRE_DEBUG':
        return { ...state, value: action.debug };
      default:
        return state;
    }
  },
  ui,
  uiQuestionnaires,
  uiResponses,
  entities
});

export const isFirstQuestion = state =>
  fromResponses.isFirstQuestion(state.responses);

export const isLastQuestion = state => {
  if (
    !fromResponses.getCurrentResponse(state.responses) ||
    !fromVersions.getCurrentVersion(state.versions)
  ) {
    return false;
  }
  return fromResponses.isLastQuestion(state.responses);
};

export const getIsShowingSubmitModal = state => {
  return state.get('ui').get('isShowingSubmissionConfirmation');
};

export const getAllQuestionnaires = state => {
  return fromQuestionnaires.getAllQuestionnaires(
    state.getIn(['entities', 'questionnaires'])
  );
};

export const getVisibleQuestions = state =>
  fromResponses
    .getVisibleResponseElements(state.responses)
    .map(responseElement => {
      const element = fromVersions.getById(
        state.versions,
        responseElement.get('elementId')
      );
      return {
        element,
        responseElement
      };
    });

export const getEndPage = state => fromVersions.getEndPage(state.versions);

export const getAnsweredQuestions = state =>
  fromResponses.getAnsweredResponseElements(state.responses);

export const getQuestions = state =>
  fromResponses.getQuestionsElements(state.responses);

export const getCurrentVersion = state =>
  fromVersions.getCurrentVersion(state.versions);
export const getCurrentResponse = state =>
  fromResponses.getCurrentResponse(state.responses);

export const getDebug = state => {
  return state.debug.value;
};

export const getHomepageQuestionnaires = state => {
  const consentTypeId = state.get('ui').get('consentTypeId');
  const userId = state.get('ui').get('userId');
  const consentTypeMapping = fromConsentTypeMappings.getByConsentTypeId(
    state.getIn(['entities', 'consentTypeMappings']),
    consentTypeId
  );
  if (!consentTypeMapping) {
    return List();
  }

  return consentTypeMapping.get('questionnaires').map(mappedQuestionnaire => {
    // get the version for that questionnaire
    const responses = fromResponses
      .getAllResponse(state.get('entities').get('responses'))
      .filter(
        response =>
          response.get('userId') === userId &&
          response.get('questionnaireId') ===
            mappedQuestionnaire.get('questionnaireId')
      );

    if (responses.size) {
      // there are responses...do something with that
      const firstResponse = responses.first();
      const version = getVersionById(state, firstResponse.get('versionId'));
      if (!version) {
        return undefined;
      }
      return version.set('response', firstResponse);
    } else {
      // there are no responses, use the version id from the mapping
      const version = getVersionById(
        state,
        mappedQuestionnaire.get('versionPublished')
      );
      return version;
    }
  });
};

export const getResponseId = state => {
  return state.getIn(['ui', 'responseId']);
};
export const getUserId = state => {
  return state.getIn(['ui', 'userId']);
};
export const getResponseElementIds = state => {
  const response = fromResponses.getById(
    state.getIn(['entities', 'responses']),
    getResponseId(state)
  );
  if (response) {
    return response.get('answeredQuestions');
  }
  return null;
};

export const getPreferNotToAnswerById = (state, responseElementId) => {
  return state.getIn([
    'entities',
    'responseElements',
    'byId',
    responseElementId,
    'preferNotToAnswer'
  ]);
};
//See logic.md to view the logic
export const getVisibleResponseElementIds = state => {
  const response = fromResponses.getById(
    state.getIn(['entities', 'responses']),
    getResponseId(state)
  );
  if (!response) {
    return null;
  }
  const responseElementIds = response.get('answeredQuestions');
  // work out which ones are visibile
  const responseElements = responseElementIds.map(id =>
    getResponseElementById(state, id)
  );
  const visibleResponseElements = responseElements.filter(
    (responseElement, index) => {
      const element = getElementById(state, responseElement.get('elementId'));
      if (element.get('type') === 'end') {
        // never show the end element, it is shown on a seprate page
        return false;
      }
      // evaluate the logic
      const logic = responseElement.get('logic');
      if (!logic) {
        return true;
      }

      // we want to replace the logic string,
      // with real logic we can eval!
      const newLogic = logic
        .replace(/(\r\n|\n|\r)/gm, '')
        .replace(/{(.*?)}/g, bits => {
          const ids = bits
            .slice(bits.lastIndexOf('/') + 1)
            .trim()
            .split(' ')
            .map(id => id.trim())
            .reduce((acc, id, index) => {
              if (index === 0) {
                return Object.assign({}, acc, { elementId: id });
              }
              return Object.assign({}, acc, {
                answerId: id.slice(0, id.length - 1)
              });
            }, {});

          const matchingResponseElement = responseElements.findLast(
            (responseElement, searchIndex) =>
              searchIndex < index &&
              responseElement.get('elementId') === ids.elementId &&
              responseElement.get('answers').contains(ids.answerId)
          );
          // we couldnt find that question + answer combo
          if (!matchingResponseElement) {
            return 'NaN';
          }
          const answerObj = getResponseElementAnswersById(state, ids.answerId);
          return JSON.stringify(answerObj);
        });
      let result = true;
      // age() might be used in the eval, so we dont know if its unsused
      /* eslint-disable no-unused-vars */
      const age = answer => {
        if (!answer.year || !answer.month || !answer.day) {
          return 'false';
        }
        const date = moment(
          `${answer.year}-${answer.month}-${answer.day}`,
          'YYYY-MM-DD'
        );
        const now = moment();
        return now.diff(date, 'years');
      };
      /* eslint-enable no-unused-vars */
      try {
        /* eslint-disable no-eval */
        result = !!eval(`true && ${newLogic}`);
        /* eslint-enable no-eval */
      } catch (e) {
        window.alert('There are an error parsing the branching logic');
      }
      return result;
    }
  );
  return visibleResponseElements.map(responseElement => {
    return responseElement.get('id');
  });
};

/**
currentIndex is needed, because when we have looping questions we look for the
answers closest to the current question (because they might have appeared 5 times cause of the looping)
we only look for the closest one
*/
export const getLogicStatement = (logic, responseElements, currentIndex) => {
  if (!logic) {
    return true;
  }
  return logic.replace(/{(.*?)}/g, bits => {
    const ids = bits
      .slice(bits.lastIndexOf('/') + 1)
      .trim()
      .split(' ')
      .map(id => id.trim())
      .reduce((acc, id, index) => {
        if (index === 0) {
          return Object.assign({}, acc, { elementId: id });
        }
        return Object.assign({}, acc, { answerId: id.slice(0, id.length - 1) });
      }, {});
    const matchingResponseElement = responseElements.findLast(
      (responseElement, index) =>
        responseElement.get('elementId') === ids.elementId &&
        index < currentIndex
    );
    if (!matchingResponseElement) {
      return false;
    }
    return matchingResponseElement
      .get('answers')
      .find(answer => answer.get('id') === ids.answerId)
      ? 'true'
      : 'false';
  });
};

export const getResponseElementById = (state, responseElementId) => {
  return fromResponseElements.getById(
    state.getIn(['entities', 'responseElements']),
    responseElementId
  );
};
export const getResponseById = (state, responseId) => {
  return fromResponses.getById(
    state.getIn(['entities', 'responses']),
    responseId
  );
};
export const getVersionById = (state, versionId) => {
  return fromVersions.getById(state.getIn(['entities', 'versions']), versionId);
};
export const getElementById = (state, elementId) => {
  return fromElements.getById(state.getIn(['entities', 'elements']), elementId);
};
export const getAnswerById = (state, answerId) => {
  return fromAnswers.getById(state.getIn(['entities', 'answers']), answerId);
};
export const getResponseElementAnswersById = (
  state,
  responseElementAnswerId
) => {
  return fromResponseElementAnswers.getById(
    state.getIn(['entities', 'responseElementAnswers']),
    responseElementAnswerId
  );
};

export const getEndPageMessage = (state, responseId) => {
  const response = getResponseById(state, responseId);
  if (!response) {
    return null;
  }
  const elements = response
    .get('answeredQuestions')
    .map(responseElementId => getResponseElementById(state, responseElementId))
    .map(responseElement => {
      return getElementById(state, responseElement.get('elementId'));
    })
    .filter(element => element && element.get('type') === 'end');
  if (!elements.size) {
    return null;
  }
  return elements.first();
};

export const getProgress = state => {
  const responseId = getResponseId(state);
  const response = getResponseById(state, responseId);
  if (!response) {
    return 0;
  }
  const questionResponseElements = getVisibleResponseElementIds(state)
    .map(id => {
      return getResponseElementById(state, id);
    })
    .filter(responseElement => {
      const element = getElementById(state, responseElement.get('elementId'));
      return questionTypes.indexOf(element.get('type')) >= 0;
    });
  if (!questionResponseElements.size) {
    // no valid elements, so...its done
    return 100;
  }
  const responseElementsWithInvalidAnswers = getResponseElementsWithInvalidAnswers(
    state
  );
  return (
    (questionResponseElements.filter(
      responseElement =>
        !!responseElement.get('answers').size ||
        responseElement.get('preferNotToAnswer')
    ).size -
      responseElementsWithInvalidAnswers.size) /
    questionResponseElements.size *
    100
  );
};

export const getResponseElementsWithInvalidAnswers = state => {
  const responseId = getResponseId(state);
  if (!responseId) {
    return List();
  }
  // check if any of the answers have invalid properties
  return getResponseById(state, responseId)
    .get('answeredQuestions')
    .map(responseElementId => getResponseElementById(state, responseElementId))
    .filter(
      responseElement =>
        getElementById(state, responseElement.get('elementId')).get('type') ===
        'date'
    )
    .filter(responseElement => {
      // keep invalid dates
      const answers = responseElement.get('answers');
      if (!answers.size) {
        return false;
      }
      const responseElementAnswer = getResponseElementAnswersById(
        state,
        responseElement.get('answers').get(0)
      );
      return (
        !responseElementAnswer.get('year') ||
        responseElementAnswer.get('year') < 1900 ||
        responseElementAnswer.get('year') > 2100 ||
        responseElementAnswer.get('year').length !== 4 ||
        !responseElementAnswer.get('day') ||
        responseElementAnswer.get('day').length === 0 ||
        !responseElementAnswer.get('month') ||
        responseElementAnswer.get('month').length === 0 ||
        responseElementAnswer.get('day') > 31 ||
        responseElementAnswer.get('day') <= 0
      );
    });
};

export const getFullResponse = state => {
  const responseId = getResponseId(state);
  const visibleResponseElementIds = getVisibleResponseElementIds(state);

  return getResponseById(
    state,
    responseId
  ).update('answeredQuestions', answeredQuestions =>
    answeredQuestions
      .map(responseElementId =>
        getResponseElementById(state, responseElementId)
      )
      .map(responseElement => {
        if (!responseElement.get('answers')) {
          return responseElement;
        }

        // Clear up invalid answers and flag it as invisible when element is not hidden
        if (!visibleResponseElementIds.includes(responseElement.get('id'))) {
          return responseElement
            .set('visible', false)
            .update('answers', responseElementAnswerIds =>
              responseElementAnswerIds.clear()
            );
        }

        return responseElement
          .set('visible', true)
          .update('answers', responseElementAnswerIds => {
            return responseElementAnswerIds.map(responseElementAnswerId =>
              getResponseElementAnswersById(state, responseElementAnswerId)
            );
          });
      })
  );
};

export const getQuestionNumber = (state, responseElementId) => {
  const responseElement = getResponseElementById(state, responseElementId);
  const element = getElementById(state, responseElement.get('elementId'));
  if (questionTypes.indexOf(element.get('type')) < 0) {
    return null;
  }
  const response = getResponseById(state, getResponseId(state));
  const responseElementIndex = response
    .get('answeredQuestions')
    .indexOf(responseElement.get('id'));
  return response
    .get('answeredQuestions')
    .filter((responseElementId, index) => {
      if (index > responseElementIndex) {
        return false;
      }
      const responseElement = getResponseElementById(state, responseElementId);
      const element = getElementById(state, responseElement.get('elementId'));
      if (questionTypes.indexOf(element.get('type')) < 0) {
        return null;
      }
      return true;
    }).size;
};
export const getFailedToDecrypt = state =>
  fromUI.getFailedToDecrypt(state.get('ui'));

export const fetchQuestionnairesIsLoading = state => {
  return state.get('uiQuestionnaires').get('isLoading');
};

export const getIsResponseLoading = state => {
  return state.get('uiResponses').get('isLoading');
};
export const getLargeText = state => fromUI.getLargeText(state.get('ui'));

export const getSubmitResponseFailure = state =>
  state.get('ui').get('submitResponseFailure');

export const getShowPreferNotToAnswerModal = state =>
  state.get('uiResponses').get('showPreferNotToAnswerModal');
