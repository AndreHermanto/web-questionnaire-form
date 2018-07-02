import { combineReducers } from 'redux-immutable';
import { List } from 'immutable';
import moment from 'moment';
import jsonLogic from 'json-logic-js';
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
import uiLandingPage from './uiLandingPage';
import * as fromReleases from './releases';
import entities from './entities';
import questionTypes from '../constants/QuestionTypes';
import * as fromPricePlans from './pricePlans';

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
  uiLandingPage,
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
  const release = fromReleases.getByConsentTypeId(
    state.getIn(['entities', 'releases']),
    consentTypeId
  );
  if (!release) {
    return List();
  }

  return release.get('questionnaires').map(mappedQuestionnaire => {
    // get the version for that questionnaire along with afterPayment flag
    const afterPayment = mappedQuestionnaire.get('afterPayment') || false;
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
      return version
        .set('response', firstResponse)
        .set('afterPayment', afterPayment);
    } else {
      // there are no responses, use the version id from the mapping
      const version = getVersionById(
        state,
        mappedQuestionnaire.get('versionPublished')
      );
      if (!version) {
        return undefined;
      }
      return version.set('afterPayment', afterPayment);
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
  const numberOfQuestionsAnswered = questionResponseElements.filter(
    responseElement =>
      !!responseElement.get('answers').size ||
      responseElement.get('preferNotToAnswer')
  ).size;
  const numberOfQuestionsWithInvalidAnswers =
    responseElementsWithInvalidAnswers.size;
  return (
    ((numberOfQuestionsAnswered - numberOfQuestionsWithInvalidAnswers) /
      questionResponseElements.size) *
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
    .filter(responseElement => {
      // keep invalid dates
      const answers = responseElement.get('answers');
      if (!answers || !answers.size) {
        return false;
      }
      const element = getElementById(state, responseElement.get('elementId'));
      if (element.get('type') === 'ontologyBased') {
        const responseElementAnswer = getResponseElementAnswersById(
          state,
          responseElement.get('answers').get(0)
        );
        return !(
          List.isList(responseElementAnswer.get('concepts')) &&
          responseElementAnswer.get('concepts').size > 0
        );
      }
      if (
        element.get('type') === 'number' ||
        element.get('type') === 'text' ||
        element.get('type') === 'uom' ||
        element.get('type') === 'uoms'
      ) {
        // does it have validation logic?
        const validationLogic = getAnswerById(
          state,
          element.getIn(['answers', '0'])
        ).get('validationLogic');

        if (!validationLogic) {
          return false;
        }
        // get out the first answer
        const responseElementAnswer = getResponseElementAnswersById(
          state,
          responseElement.get('answers').get(0)
        );
        if (element.get('type') === 'uoms') {
          const uom1 = responseElementAnswer.get('uom1');
          const uom2 = responseElementAnswer.get('uom2');
          const logic1 = validationLogic.get('uom1')
            ? validationLogic.get('uom1').toJS()
            : null;
          const logic2 = validationLogic.get('uom2')
            ? validationLogic.get('uom2').toJS()
            : null;

          if (!logic1 && !logic2) {
            // no logic at all
            return false;
          }
          let isValid1 = true,
            isValid2 = true;
          if (logic1) {
            isValid1 = jsonLogic.apply(logic1, {
              uom1: parseInt(uom1, 10)
            });
          }
          if (logic2) {
            isValid2 = jsonLogic.apply(logic2, {
              uom2: parseInt(uom2, 10)
            });
          }
          return !isValid1 || !isValid2;
        }
        if (element.get('type') === 'uom') {
          const uom1 = responseElementAnswer.get('uom1');
          const logic = validationLogic.get('uom1')
            ? validationLogic.get('uom1').toJS()
            : null;
          if (!logic) {
            return false;
          }
          const isValid = jsonLogic.apply(logic, {
            uom1: parseInt(uom1, 10)
          });
          return !isValid;
        }
        if (element.get('type') === 'number') {
          const number = responseElementAnswer.get('number');
          const logic = validationLogic.get('number')
            ? validationLogic.get('number').toJS()
            : null;
          if (!logic) {
            return false;
          }
          const isValid = jsonLogic.apply(logic, {
            number: parseInt(number, 10)
          });
          return !isValid;
        }
        if (element.get('type') === 'text') {
          const text = responseElementAnswer.get('text');
          const logic = validationLogic.get('text')
            ? validationLogic.get('text').toJS()
            : null;
          if (!logic) {
            return false;
          }
          const isValid = jsonLogic.apply(logic, {
            text: text
          });
          return !isValid;
        }
        return false;
      }
      if (element.get('type') !== 'date') {
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
        responseElementAnswer.get('day') <= 0 ||
        !moment(
          `${responseElementAnswer.get('year')}-${responseElementAnswer.get(
            'month'
          )}-${responseElementAnswer.get('day')}`,
          'YYYY-MM-DD'
        ).isValid()
      );
    });
};

export const getFullResponse = state => {
  const responseId = getResponseId(state);
  const visibleResponseElementIds = getVisibleResponseElementIds(state);

  return getResponseById(state, responseId).update(
    'answeredQuestions',
    answeredQuestions =>
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

export const getIsResponseLoading = state =>
  state.get('uiResponses').get('isLoading');
export const getIsResponseError = state =>
  state.get('uiResponses').get('isError');
export const getIsResponseUpdating = state =>
  state.get('uiResponses').get('isResponseUpdating');

export const getLargeText = state => fromUI.getLargeText(state.get('ui'));

export const getSubmitResponseFailure = state =>
  state.get('ui').get('submitResponseFailure');

export const getShowPreferNotToAnswerModal = state =>
  state.get('uiResponses').get('showPreferNotToAnswerModal');

export const getShowNoneOfTheAboveAnswerModal = state =>
  state.get('uiResponses').get('showNoneOfTheAboveAnswerModal');

export const getLandingPage = state => {
  return state.get('uiLandingPage').get('selectedConsentType');
};

export const isLoadingReponses = state => {
  return state.getIn(['uiResponses', 'isLoading']);
};

export const getAllPricePlans = state => {
  return fromPricePlans.getAllPricePlans(
    state.getIn(['entities', 'pricePlans'])
  );
};
