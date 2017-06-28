import reducer, * as fromReducer from '../reducers';
import { fromJS } from 'immutable';

test('reducer exists', () => {
  expect(!!reducer).toBe(true);
});

describe('getVisibleQuestions', () => {
  it('gets responseElement + element for current question, and all past questions`', () => {
    // put test here
  })
})

describe('isLastQuestion', () => {
  it('is hidden when nothing is loaded', () => {
    const state = {
      responses: {
        items: fromJS({})
      }
    }
    expect(fromReducer.isLastQuestion(state)).toBe(false);
  });
});
