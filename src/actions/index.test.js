import { fromJS } from 'immutable';
import fetchMock from 'fetch-mock';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../actions';
import * as types from '../constants/ActionTypes';
// setup a fake store - https://github.com/reactjs/redux/blob/master/docs/recipes/WritingTests.md#async-action-creators
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

// mock jest
jest.mock('cuid');
const cuid = require('cuid');
cuid
  .mockReturnValueOnce('uid1')
  .mockReturnValueOnce('uid2')
  .mockReturnValue('uid3');

describe('REPEAT_SECTION', () => {
  it('repeats the section', () => {
    const responseId = '1';
    const responseElementId = '3';
    const answerId = '1';
    const state = fromJS({
      ui: {
        responseId
      },
      entities: {
        responses: {
          byId: {
            [responseId]: {
              id: responseId,
              answeredQuestions: ['1', '2', '3']
            }
          }
        },
        responseElements: {
          byId: {
            '1': {
              id: '1',
              elementId: '1',
              answers: [{ id: '1' }]
            },
            '2': {
              id: '2',
              elementId: '2'
            },
            '3': {
              id: '3',
              elementId: '3'
            }
          }
        },
        elements: {
          byId: {
            '1': {
              id: '1'
            },
            '2': {
              id: '2'
            },
            '3': {
              id: '3',
              answers: ['1']
            }
          }
        },
        answers: {
          byId: {
            '1': {
              goTo: {
                id: '1'
              }
            }
          }
        }
      }
    });

    const getState = () => state;
    const dispatch = action => {
      expect(action).toEqual({
        type: 'REPEAT_SECTION',
        payload: {
          result: responseId,
          entities: {
            responses: {
              [responseId]: {
                id: responseId,
                answeredQuestions: ['1', '2', '3', 'uid1', 'uid2', 'uid3']
              }
            },
            responseElements: {
              uid1: {
                id: 'uid1',
                elementId: '1',
                answers: []
              },
              uid2: {
                id: 'uid2',
                elementId: '2',
                answers: []
              },
              uid3: {
                id: 'uid3',
                elementId: '3',
                answers: []
              }
            }
          }
        }
      });
    };
    actions.checkForRepeats(responseElementId, answerId)(dispatch, getState);
  });
});

describe('submit response', () => {
  it('should change the response to be completed', () => {
    const responseId = '1';
    const state = fromJS({
      entities: {
        responses: {
          byId: {
            [responseId]: {
              id: responseId,
              completed: false
            }
          }
        }
      },
      ui: {
        responseId
      }
    });
    const getState = () => state;
    const dispatch = action => {
      if (typeof action === 'function') {
        // ignore any of the async actions (like saving to the server)
        return Promise.resolve();
      }
      expect(action.payload.entities.responses[responseId].completed).toBe(
        true
      );
    };
    const encryptedUserId = 'aaa';
    const encryptedConsentTypeId = 'bbb';
    actions.submitResponse(encryptedUserId, encryptedConsentTypeId)(
      dispatch,
      getState
    );
  });
});

describe('setFollowUpResponse', () => {
  it('works', () => {
    const responseElementId = '1';
    const answerId = '1';
    const store = mockStore(
      fromJS({
        entities: {
          responseElementAnswers: {
            byId: {
              [answerId]: {
                id: answerId
              }
            }
          }
        }
      })
    );
    const expectedActions = [
      {
        type: types.SET_FOLLOW_UP_RESPONSE,
        payload: {
          entities: {
            responseElementAnswers: {
              [answerId]: {
                id: answerId,
                followUp: { text: 'my text' }
              }
            }
          },
          result: answerId
        }
      }
    ];
    store.dispatch(
      actions.updateFollowUpResponse(responseElementId, answerId, 'my text')
    );
    expect(store.getActions()).toEqual(expectedActions);
  });
});
// export const setFollowUpResponse = (
//   responseElementId,
//   answerId,
//   followUpText
// ) => (dispatch, getState) => {
//   const state = getState();
//   const responseElementAnswer = selectors
//     .getResponseElementAnswersById(state, answerId)
//     .set('followUp', Immutable.fromJS({ text: followUpText }));
//   dispatch({
//     type: types.SET_FOLLOW_UP_RESPONSE,
//     payload: normalize(
//       responseElementAnswer.toJS(),
//       schema.responseElementAnswer
//     )
//   });
// };

describe('persisting a response on the server', () => {
  afterEach(() => {
    fetchMock.reset();
  });
  it('creates UPDATE_RESPONSE_SUCCESS when PUTing response has been done', () => {
    const responseId = '1';

    process.env.REACT_APP_BASE_URL = 'http://localhost:5000';
    fetchMock
      .put(`http://localhost:5000/responses/${responseId}`, {
        body: {
          status: 200,
          data: { id: responseId }
        }
      })
      .catch(unmatchedUrl => {
        // fallover call original fetch, because fetch-mock treats
        // any unmatched call as an error - its target is testing
        expect(unmatchedUrl).toBe(undefined);
      });

    const expectedActions = [
      { type: types.UPDATE_RESPONSE_REQUEST },
      {
        type: types.UPDATE_RESPONSE_SUCCESS,
        payload: {
          entities: {
            responses: {
              [responseId]: {
                id: responseId
              }
            }
          },
          result: responseId
        }
      }
    ];
    const store = mockStore(
      fromJS({
        ui: {
          responseId
        },
        entities: {
          responses: {
            byId: {
              [responseId]: { id: responseId, answeredQuestions: [] }
            }
          }
        }
      })
    );
    return store.dispatch(actions.updateResponseOnServer()).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});

/*describe('selectAnswer', () => {
  it('works', () => {
    const responseElementId = '1';
    const answerId = '1';
    const store = mockStore(
      fromJS({
        entities: {
          answers: {
            byId: [{[answerId]: {
              id: answerId
            }}]
          },
          responseElement: {
            byId: {
              id: responseElementId,
              [responseElementId]: {
                answers: [answerId]
              }
            }
          }
        }
      })
    );
    const expectedActions = [
      {
        type: "TOGGLE_ANSWER",
        payload: {
          entities: {
            responseElementAnswers: {
              [answerId]: {
                id: answerId
              }
            }
          },
          result: "1"
        },
        responseElementId: responseElementId
      }
    ];
    store.dispatch(
      actions.toggleAnswer(responseElementId, answerId)
    );
    expect(store.getActions()).toEqual(expectedActions);
  });
});*/
