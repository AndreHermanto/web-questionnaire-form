import { combineReducers } from 'redux-immutable';
import { fromJS, List } from 'immutable';
import * as types from '../constants/ActionTypes';
import { dedup } from '../helpers';
import get from 'lodash.get';

const byId = (state = fromJS({}), action) => {
  // if its got responses, add it
  if (get(action, 'payload.entities.responses', false)) {
    return state.merge(fromJS(action.payload.entities.responses));
  }
  return state;
};

const allIds = (state = List(), action) => {
  switch (action.type) {
    case types.FETCH_RESPONSES_SUCCESS:
      return dedup(state.concat(action.payload.result));
    case types.FETCH_RESPONSE_SUCCESS:
      return dedup(state.push(action.payload.result));
    default:
      return state;
  }
};

const responses = combineReducers({
  byId,
  allIds
});

export default responses;

export const getAllResponse = state => {
  return state.get('allIds').map(id => state.get('byId').get(id));
};
export const getById = (state, id) => {
  return state.get('byId').get(id);
};

// import { fromJS, List } from 'immutable';
// import cuid from 'cuid';
// import * as types from '../constants/ActionTypes';
// import { isQuestion } from '../helpers/questions';
// const initialState = {
//   items: fromJS({}),
//   isError: false,
//   isLoading: false,
//   index: null,
//   currentId: null
// };

// const responses = (state = initialState, action) => {
//   switch (action.type) {
//     case types.RESUME_QUESTIONNAIRE: {
//       // resuming the questionnaire now!
//       const response = getCurrentResponse(state);
//       // get last viewed, or, first (0) if none viewed
//       const lastViewedIndex = Math.max(
//         response
//           .get('answeredQuestions')
//           .findLastIndex(
//             responseElement => responseElement.get('viewed') === true
//           ),
//         0
//       );
//       // mark as viewed (if not already viewed)
//       const nextState = {
//         ...state,
//         index: lastViewedIndex,
//         items: markQuestionAsViewed(
//           state,
//           response.get('id'),
//           lastViewedIndex
//         ).updateIn([state.currentId, 'answeredQuestions'], updateLogic)
//       };
//       return nextState;
//     }
//     case types.PREVIOUS_QUESTION: {
//       const previousIndex = getCurrentResponse(state)
//         .get('answeredQuestions')
//         .findLastIndex(
//           (responseElement, index) =>
//             index < state.index && responseElement.get('viewed') === true
//         );
//       if (previousIndex === -1) {
//         return state;
//       }
//       return {
//         ...state,
//         index: previousIndex
//       };
//     }
//     case types.NEXT_QUESTION: {
//       let items = state.items;
//       // does this question have a loop back?
//       const answersWithLoopBack = state.items
//         .getIn([state.currentId, 'answeredQuestions', state.index, 'answers'])
//         .filter(answer => !!answer.get('loopBackTo'));
//       if (answersWithLoopBack.size) {
//         const loopBackToIndex = state.items
//           .getIn([state.currentId, 'answeredQuestions'])
//           .findLastIndex(
//             (responseElement, index) =>
//               index < state.index &&
//               responseElement.get('elementId') ===
//                 answersWithLoopBack.getIn([0, 'loopBackTo'])
//           );
//         items = items.updateIn(
//           [state.currentId, 'answeredQuestions'],
//           responseElements =>
//             responseElements
//               .slice(0, state.index + 1)
//               .concat(
//                 responseElements
//                   .slice(loopBackToIndex, state.index + 1)
//                   .map(responseElement =>
//                     responseElement
//                       .set('id', cuid())
//                       .set('viewed', false)
//                       .set('answers', fromJS([]))
//                   )
//                   .setIn([0, 'viewed'], true)
//               )
//               .concat(responseElements.slice(state.index + 1))
//         );
//       }
//
//       // calculate visibility
//       items = items.updateIn(
//         [state.currentId, 'answeredQuestions'],
//         updateLogic
//       );
//       // calculate next visible item
//       const index = items
//         .get(state.currentId)
//         .get('answeredQuestions')
//         .findIndex((responseElement, index) => {
//           return (
//             index > state.index &&
//             responseElement.get('type') !== 'section' &&
//             responseElement.get('visible')
//           );
//         });
//       return {
//         ...state,
//         index: index !== -1
//           ? index
//           : items.get(state.currentId).get('answeredQuestions').size - 1, // cant find one, go to the end
//         items: items.setIn(
//           [state.currentId, 'answeredQuestions', index, 'viewed'],
//           true
//         ) // mark as viewed
//       };
//     }
//     //
//     // const { element } = action.payload;
//     // if (state.index ===
//     //   response.get('answeredQuestions').size - 1) {
//     //   return state;
//     // }
//     // let nextIndex;
//     // if (
//     //   element.get('type') === 'textinformation' ||
//     //   element.get('type') === 'section'
//     // ) {
//     //   nextIndex = Math.min(state.index + 1, getCurrentResponse(state).get('answeredQuestions').size - 1);
//     // } else {
//     //   const responseElement = response.getIn(['answeredQuestions', state.index]);
//     //   const chosenAnswerWithSkipLogic =
//     //     element
//     //       .get('answers')
//     //       .filter(answer =>
//     //         answer.get('goTo') &&
//     //         responseElement
//     //           .get('answers')
//     //           .find(chosenAnswer =>
//     //             answer.get('id') === chosenAnswer.get('id')
//     //           )
//     //       );
//     //   if(!chosenAnswerWithSkipLogic.size) {
//     //     nextIndex = Math.min(state.index + 1, getCurrentResponse(state).get('answeredQuestions').size - 1);
//     //   } else {
//     //     nextIndex = response
//     //       .get('answeredQuestions')
//     //       .findIndex((responseElement, index) =>
//     //         index > state.index &&
//     //         responseElement.get('elementId') ===
//     //           chosenAnswerWithSkipLogic
//     //             .first()
//     //             .getIn(['goTo', 'id'])
//     //       );
//     //     // couldnt find it forward, looking backwards
//     //     if(nextIndex === -1) {
//     //       // just go to the next question
//     //       nextIndex = Math.min(state.index + 1, getCurrentResponse(state).get('answeredQuestions').size - 1);
//     //       var lookBackToIndex = response
//     //         .get('answeredQuestions')
//     //         .findLastIndex((responseElement, index) =>
//     //           index < state.index &&
//     //           responseElement.get('elementId') ===
//     //             chosenAnswerWithSkipLogic
//     //               .first()
//     //               .getIn(['goTo', 'id'])
//     //         );
//     //       // const lookBackToIndex2 = 0;
//     //       if (lookBackToIndex === -1) {
//     //         throw new Error('Skip logic found no matching section');
//     //       }
//     //       // duplicate stuff
//     //       // TODO: refactor this section, move it to actions, no cuid() should be used in the reducer
//     //       const items = state.items
//     //         .updateIn([
//     //           response.get('id'),
//     //           'answeredQuestions'],
//     //           responseElements =>
//     //             responseElements
//     //               .slice(0, state.index + 1)
//     //               .concat(
//     //                 responseElements
//     //                   .slice(lookBackToIndex, state.index + 1)
//     //                   .map(responseElement => responseElement.set('id', cuid()).set('viewed', false).set('answers', fromJS([])))
//     //                   .setIn([0, 'viewed'], true)
//     //               )
//     //               .concat(
//     //                 responseElements.slice(state.index + 1)
//     //               )
//     //         );
//     //       return {
//     //         ...state,
//     //         index: nextIndex,
//     //         items
//     //       };
//
//     // }
//     // }
//     //
//     //   }
//     //
//     //   const items = markQuestionAsViewed(
//     //     state,
//     //     response.get('id'),
//     //     nextIndex);
//     //   return {
//     //     ...state,
//     //     index: nextIndex,
//     //     items
//     //   };
//     // }
//     case types.SET_QUESTION_ANSWER: {
//       // find the index
//       const { index, responseElement } = action.payload;
//       return {
//         ...state,
//         items: state.items
//           .setIn([state.currentId, 'answeredQuestions', index], responseElement)
//           .updateIn([state.currentId, 'answeredQuestions'], updateLogic)
//       };
//     }
//     case types.SET_MATRIX_QUESTION_ANSWER: {
//       // find the index
//       var items = state.items;
//       const {
//         responseElementId,
//         questionId,
//         answerId,
//         selected
//       } = action.payload;
//       // responseElementIndex
//       const responseElementIndex = items
//         .getIn([state.currentId, 'answeredQuestions'])
//         .findIndex(
//           responseElement => responseElement.get('id') === responseElementId
//         );
//       let matrixQuestionAnswerIndex = items
//         .getIn([
//           state.currentId,
//           'answeredQuestions',
//           responseElementIndex,
//           'answers'
//         ])
//         .findIndex(answer => answer.get('questionId') === questionId);
//
//       if (matrixQuestionAnswerIndex === -1) {
//         items = items.updateIn(
//           [
//             state.currentId,
//             'answeredQuestions',
//             responseElementIndex,
//             'answers'
//           ],
//           matrixQuestionAnswers =>
//             matrixQuestionAnswers.push(
//               fromJS({
//                 questionId,
//                 answers: []
//               })
//             )
//         );
//         matrixQuestionAnswerIndex =
//           items.getIn([
//             state.currentId,
//             'answeredQuestions',
//             responseElementIndex,
//             'answers'
//           ]).size - 1;
//       }
//       const answerIndex = items
//         .getIn([
//           state.currentId,
//           'answeredQuestions',
//           responseElementIndex,
//           'answers',
//           matrixQuestionAnswerIndex,
//           'answers'
//         ])
//         .findIndex(answer => answer.get('id') === answerId);
//
//       if (selected) {
//         items = items.setIn(
//           [
//             state.currentId,
//             'answeredQuestions',
//             responseElementIndex,
//             'answers',
//             matrixQuestionAnswerIndex,
//             'answers',
//             answerIndex,
//             'id'
//           ],
//           answerId
//         );
//       } else {
//         items = items.deleteIn([
//           state.currentId,
//           'answeredQuestions',
//           responseElementIndex,
//           'answers',
//           matrixQuestionAnswerIndex,
//           'answers',
//           answerIndex,
//           'id'
//         ]);
//       }
//       return {
//         ...state,
//         items: items.updateIn(
//           [state.currentId, 'answeredQuestions'],
//           updateLogic
//         )
//       };
//     }
//     case types.SET_RESPONSE: {
//       const response = fromJS(action.response);
//       return {
//         ...state,
//         items: state.items
//           .set(response.get('id'), response)
//           .updateIn([state.currentId, 'answeredQuestions'], updateLogic)
//       };
//     }
//     case types.FETCH_RESPONSES_FAILURE:
//     case types.FETCH_VERSION_REQUEST:
//       return state;
//     case types.FETCH_RESPONSES_SUCCESS: {
//       const responses = fromJS(action.payload.entities.responses).valueSeq();
//       return {
//         ...state,
//         currentId: responses.size ? responses.last().get('id') : null,
//         items: responses.reduce(
//           (carry, response) => carry.set(response.get('id'), response),
//           state.items
//         )
//       };
//     }
//     case types.CREATE_RESPONSE_REQUEST:
//       return {
//         ...state,
//         currentId: null
//       };
//     case types.CREATE_RESPONSE_SUCCESS: {
//       const response = fromJS(action.payload);
//       return {
//         ...state,
//         currentId: response.get('id'),
//         items: state.items.set(response.get('id'), response)
//       };
//     }
//     case types.CREATE_RESPONSE_FAILURE:
//       return state;
//     case types.SUBMIT_RESPONSE:
//       return {
//         ...state,
//         items: state.items.setIn([state.currentId, 'completed'], true)
//       };
//     default:
//       return state;
//   }
// };

// export default responses;

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

export const getCurrentResponse = state => {
  return null;
  // if (state.currentId) {
  // return state.items.get(state.currentId);
  // }
  // TODO: remove this, should always use current id
  // return state.items.size ? state.items.first() : null;
};

export const getVisibleResponseElements = state => {
  return List();
  // if (!state.items.size) {
  //   return List();
  // }
  // return getCurrentResponse(state)
  //   .get('answeredQuestions')
  //   .slice(0, state.index + 1)
  //   .filter(responseElement => responseElement.get('visible'))
  //   .filter(responseElement => responseElement.get('type') !== 'end');
};

export const getAnsweredResponseElements = state => {
  // if (!state.items.size) {
  return List();
  // }
  // return getCurrentResponse(state)
  // .get('answeredQuestions')
  // .filter(responseElement => responseElement.get('answers').size > 0);
};

export const getQuestionsElements = state => {
  // if (!state.items.size) {
  return List();
  // }
  // return getCurrentResponse(state)
  // .get('answeredQuestions')
  // .filter(responseElement => isQuestion(responseElement));
};

export const getCurrentResponseIndex = state => {
  return state.items.first().get('id');
};
export const getCurrentElementId = state => {
  return getCurrentResponse(state).getIn([
    'answeredQuestions',
    state.index,
    'elementId'
  ]);
};
export const isLastQuestion = (state, currentElement) => {
  const response = getCurrentResponse(state);
  if (state.index === response.get('answeredQuestions').size - 1) {
    return true;
  }
  if (
    response
      .get('answeredQuestions')
      .slice(state.index + 1)
      .reduce(
        (acc, responseElement) => acc & !responseElement.get('visible'),
        true
      )
  ) {
    return true;
  }
  return false;
};

export const isFirstQuestion = state => state.index !== 0;
