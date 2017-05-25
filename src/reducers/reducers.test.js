import reducer, * as fromReducer from '../reducers';
import { fromJS } from 'immutable';

test('reducer exists', () => {
  expect(!!reducer).toBe(true);
});

describe('getVisibleQuestions', () => {
  it('gets responseElement + element for current question, and all past questions`', () => {

  })
})

describe('isShowingSubmit', () => {
  it('is hidden when nothing is loaded', () => {
    const state = {
      responses: {
        items: fromJS({})
      }
    }
    expect(fromReducer.isShowingSubmit(state)).toBe(false);
  });

  it('is hidden when not on the last question', () => {
    const state = {
      responses: {
        index: 0,
        items: fromJS({
          'asdf': { answeredQuestions: [{}, {}] }
        })
      }
    }
    expect(fromReducer.isShowingSubmit(state)).toBe(false);
  });
  it('is visible when on the last question', () => {
    const state = {
      responses: {
        index: 1,
        items: fromJS({
          'asdf': { answeredQuestions: [{}, {}] }
        })
      }
    }
    expect(fromReducer.isShowingSubmit(state)).toBe(true);
  });
})
// import mainReducer from '../reducers'
//
// describe('mainReducer test', () => {
//   it('should add the questionnaires list', () => {
//     const questionnaires = [{creator:"ut,nostrum,qui", currentTitle:"Perspiciatis aut maiores quisquam maxime dolores sed.",
//       currentVersionId:"rJoYL2qxb", dateCreated:"Thu May 18 2017 05:08:35 GMT+1000 (AEST)",id:"5e3dd7b8-6ca3-4357-bc93-a2d453b81d62",
//       lastUpdated:"Wed May 17 2017 18:44:55 GMT+1000 (AEST)",status:"qui,dolores,aut"}];
//     expect(
//       mainReducer({}, {
//         type: 'ADD_QUESTIONNAIRES',
//         payload: questionnaires
//       }).questionnaires
//     ).toEqual(questionnaires)
//   })
//   it('should return selected questionnaire', () => {
//     const questionnaire = [{creator:"ut,nostrum,qui", currentTitle:"Perspiciatis aut maiores quisquam maxime dolores sed.",
//       currentVersionId:"rJoYL2qxb", dateCreated:"Thu May 18 2017 05:08:35 GMT+1000 (AEST)",id:"5e3dd7b8-6ca3-4357-bc93-a2d453b81d62",
//       lastUpdated:"Wed May 17 2017 18:44:55 GMT+1000 (AEST)",status:"qui,dolores,aut"}];
//     expect(
//       mainReducer({}, {
//         type: 'ADD_QUESTIONNAIRE',
//         payload: questionnaire
//       }).questionnaire
//     ).toEqual(questionnaire)
//   })
//   it('should set new respone to the questionnaire', () => {
//     expect(
//       mainReducer({}, {
//         type: 'SET_RESPONSE',
//         response: 'test response'
//       }).response
//     ).toEqual('test response')
//   })
//   it('should set new version to the questionnaire', () => {
//     expect(
//       mainReducer({}, {
//         type: 'SET_VERSION',
//         version: 'test version'
//       }).version
//     ).toEqual('test version')
//   })
// })
