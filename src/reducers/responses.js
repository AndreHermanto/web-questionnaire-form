import { fromJS, List } from 'immutable';
import cuid from 'cuid';
import * as types from '../constants/ActionTypes';

const initialState = {
  items: fromJS({}),
  isError: false,
  isLoading: false,
  index: null
};

export const getVisibleResponseElements = (state) => {
  if (!state.items.size) {
    return List();
  }
  return getCurrentResponse(state)
    .get('answeredQuestions')
    .slice(0, state.index + 1)
    .filter(responseElement => responseElement.get('viewed'))
}

export const getCurrentResponse = (state) => {
  return state.items.first() || null;
}
export const getCurrentResponseIndex = (state) => {
  return state.items.first().get('id');
}

export const isLastQuestion = state =>
  state.index === getCurrentResponse(state).get('answeredQuestions').size - 1;
export const isShowingBackButton = state => state.index !== 0;
export const isShowingNextButton = state => !isLastQuestion(state)

const markQuestionAsViewed = (state, responseId, responseElementIndex) => {
  return state.items.setIn([
    responseId,
    'answeredQuestions',
    responseElementIndex,
    'viewed'
  ], true);
}
const responses = (state = initialState, action) => {
  switch (action.type) {
    case types.RESUME_QUESTIONNAIRE: {
      // resuming the questionnaire now!
      const response = getCurrentResponse(state);
      // get last viewed, or, first (0) if none viewed
      const lastViewedIndex = Math.max(
        response.get('answeredQuestions')
          .findLastIndex(responseElement =>
            responseElement.get('viewed') === true
          ),
        0
      );
      // mark as viewed (if not already viewed)
      const nextState = {
        ...state,
        index: lastViewedIndex,
        items: markQuestionAsViewed(
          state,
          response.get('id'),
          lastViewedIndex)
      };
      return nextState;
    }
    case types.PREVIOUS_QUESTION: {
      const previousIndex = getCurrentResponse(state)
        .get('answeredQuestions')
        .findLastIndex((responseElement, index) =>
          index < state.index &&
          responseElement.get('viewed') === true
        );
      if (previousIndex === -1) {
        return state;
      }
      return {
        ...state,
        index: previousIndex
      };
    }
    case types.NEXT_QUESTION: {
      const response = getCurrentResponse(state);
      const { element } = action.payload;
      if (state.index ===
        response.get('answeredQuestions').size - 1) {
        return state;
      }
      let nextIndex;
      if (
        element.get('type') === 'textinformation' ||
        element.get('type') === 'section'
      ) {
        nextIndex = Math.min(state.index + 1, getCurrentResponse(state).get('answeredQuestions').size - 1);
      } else {
        const responseElement = response.getIn(['answeredQuestions', state.index]);
        const chosenAnswerWithSkipLogic =
          element
            .get('answers')
            .filter(answer =>
              answer.get('goTo') &&
              responseElement
                .get('answers')
                .find(chosenAnswer =>
                  answer.get('id') === chosenAnswer.get('id')
                )
            );
        if(!chosenAnswerWithSkipLogic.size) {
          nextIndex = Math.min(state.index + 1, getCurrentResponse(state).get('answeredQuestions').size - 1);
        } else {
          nextIndex = response
            .get('answeredQuestions')
            .findIndex((responseElement, index) =>
              index > state.index &&
              responseElement.get('elementId') ===
                chosenAnswerWithSkipLogic
                  .first()
                  .getIn(['goTo', 'id'])
            );
          // couldnt find it forward, looking backwards
          if(nextIndex === -1) {
            // just go to the next question
            nextIndex = Math.min(state.index + 1, getCurrentResponse(state).get('answeredQuestions').size - 1);
            var lookBackToIndex = response
              .get('answeredQuestions')
              .findLastIndex((responseElement, index) =>
                index < state.index &&
                responseElement.get('elementId') ===
                  chosenAnswerWithSkipLogic
                    .first()
                    .getIn(['goTo', 'id'])
              );
            // const lookBackToIndex2 = 0;
            if (lookBackToIndex === -1) {
              throw new Error('Skip logic found no matching section');
            }
            // duplicate stuff
            // TODO: refactor this section, move it to actions, no cuid() should be used in the reducer
            const items = state.items
              .updateIn([
                response.get('id'),
                'answeredQuestions'],
                responseElements =>
                  responseElements
                    .slice(0, state.index + 1)
                    .concat(
                      responseElements
                        .slice(lookBackToIndex, state.index + 1)
                        .map(responseElement => responseElement.set('id', cuid()).set('viewed', false).set('answers', fromJS([])))
                        .setIn([0, 'viewed'], true)
                    )
                    .concat(
                      responseElements.slice(state.index + 1)
                    )
              );
            return {
              ...state,
              index: nextIndex,
              items
            };

          }
        }

      }

      const items = markQuestionAsViewed(
        state,
        response.get('id'),
        nextIndex);
      return {
        ...state,
        index: nextIndex,
        items
      };
    }
    case 'SET_RESPONSE': {
      const response = fromJS(action.response);
      return {
        ...state,
        items: state.items.set(response.get('id'), response)
      };
    }
    case types.FETCH_RESPONSES_FAILURE:
    case types.FETCH_VERSION_REQUEST:
      return state;
    case types.FETCH_RESPONSES_SUCCESS: {
      const responses = fromJS(action.payload.responses);
      return {
        ...state,
        items: responses.reduce((carry, response) => carry.set(response.get('id'), response), state.items)
      };
    }
    case types.CREATE_RESPONSE_REQUEST:
      return state;
    case types.CREATE_RESPONSE_SUCCESS: {
      const response = fromJS(action.payload);
      return {
        ...state,
        items: state.items.set(response.get('id'), response)
      };
    }
    case types.CREATE_RESPONSE_FAILURE:
      return state;
    default:
      return state;
  }
};

export default responses;
