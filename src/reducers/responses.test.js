import { fromJS } from 'immutable';
import responses, { getCurrentResponse, getVisibleResponseElements } from './responses';
import {
  resumeQuestionnaire,
  previousQuestion,
  nextQuestion
} from '../actions';

test('responses exists', () => {
  expect(!!responses).toBe(true);
});

describe('resuming a questionnaire', () => {
  it('goes to first question and mark it as viewed if the user hasnt started yet', () => {
    const userId = 1;
    const versionId = 1;
    const questionnaireId = 'abcd';
    const state = responses({
      items: fromJS({ [questionnaireId]: {
        id: questionnaireId,
        answeredQuestions: [{ id: 1, viewed: false }]
      }})
    }, resumeQuestionnaire({ userId, versionId }));
    expect(state.index).toBe(0);
    expect(getCurrentResponse(state)
      .getIn(['answeredQuestions', 0, 'viewed'])
    ).toBe(true);
  });

  it('goes to the last viewed question', () => {
    const userId = 1;
    const versionId = 1;
    const questionnaireId = 'abcd';
    const state = responses({
      items: fromJS({ [questionnaireId]: {
        answeredQuestions: [
          { id: 1, viewed: true },
          { id: 2, viewed: true },
          { id: 3, viewed: false },
          { id: 4, viewed: false }
      ]}})
    }, resumeQuestionnaire({ userId, versionId }));
    expect(state.index).toBe(1);
  });
});

describe('previous question', () => {
  it('goes to the last viewed question', () => {
    const questionnaireId = 'abcd';
    const state = responses({
      index: 2,
      items: fromJS({ [questionnaireId]: {
        answeredQuestions: [
          { id: 1, viewed: true },
          { id: 2, viewed: true },
          { id: 3, viewed: true },
          { id: 4, viewed: false }
      ]}})
    }, previousQuestion());
    expect(state.index).toBe(1);
  });
  it('stays where it is, if it cant go back', () => {
    const questionnaireId = 'abcd';
    const state = responses({
      index: 2,
      items: fromJS({ [questionnaireId]: {
        answeredQuestions: [
          { id: 1, viewed: false },
          { id: 2, viewed: false },
          { id: 3, viewed: true },
          { id: 4, viewed: false }
      ]}})
    }, previousQuestion());
    expect(state.index).toBe(2);
  });
})

describe('next question', () => {
  it('marks the next question as viewed', () => {
    const questionnaireId = 'abcd';
    const element = fromJS({ answers: [{ id: 100, goTo: { id: 10 } }]})
    const state = responses({
      index: 0,
      items: fromJS({ [questionnaireId]: {
        id: questionnaireId,
        answeredQuestions: [
          { id: 1, viewed: true, answers: [] },
          { id: 2, viewed: false, answers: [] },
          { id: 3, viewed: false, answers: [] },
          { id: 4, viewed: false, answers: [] }
      ]}})
    }, nextQuestion({ element }));
    expect(state.items.getIn([
      questionnaireId,
      'answeredQuestions',
      1,
      'viewed'])).toBe(true);
  })
  it('goes to the next question, if no skip logic', () => {
    const questionnaireId = 'abcd';
    const element = fromJS({ answers: [{ id: 100, goTo: { id: 10 } }]})
    const state = responses({
      index: 0,
      items: fromJS({ [questionnaireId]: {
        id: questionnaireId,
        answeredQuestions: [
          { id: 1, viewed: true, answers: [] },
          { id: 2, viewed: false, answers: [] },
          { id: 3, viewed: false, answers: [] },
          { id: 4, viewed: false, answers: [] }
      ]}})
    }, nextQuestion({ element }));
    expect(state.index).toBe(1);
  })

  it('follows the skip logic', () => {
    const questionnaireId = 'abcd';
    const element = fromJS({ answers: [{ id: 100, goTo: { id: 10 } }]})
    const state = responses({
      index: 0,
      items: fromJS({ [questionnaireId]: {
        id: questionnaireId,
        answeredQuestions: [
          { id: 1, viewed: true, answers: [{ id: 100 }] },
          { id: 2, viewed: false, answers: [] },
          { id: 3, elementId: 10, viewed: false },
          { id: 4, viewed: false, answers: [] }
      ]}})
    }, nextQuestion({ element }));
    expect(state.index).toBe(2);
  })

  it('wont go past the last question', () => {
    const questionnaireId = 'abcd';
    const element = fromJS({ answers: [{ id: 100, goTo: { id: 10 } }]})
    const state = responses({
      index: 3,
      items: fromJS({ [questionnaireId]: {
        id: questionnaireId,
        answeredQuestions: [
          { id: 1, viewed: true, answers: [] },
          { id: 2, viewed: true, answers: [] },
          { id: 3, viewed: true, answers: [] },
          { id: 4, viewed: true, answers: [] }
      ]}})
    }, nextQuestion({ element }));
    expect(state.index).toBe(3);
  })

  it('just goes forward if heading', () => {
    const questionnaireId = 'abcd';
    const element = fromJS({ id: 'a', type: 'section' });
    const state = responses({
      index: 0,
      items: fromJS({ [questionnaireId]: {
        id: questionnaireId,
        answeredQuestions: [
          { id: 1, elementId: 'a', viewed: true, answers: [] },
          { id: 2, viewed: true, answers: [] },
          { id: 3, viewed: true, answers: [] },
          { id: 4, viewed: true, answers: [] }
      ]}})
    }, nextQuestion({ element }));
    expect(state.index).toBe(1);
  });
  it('just goes forward if text information', () => {
    const questionnaireId = 'abcd';
    const element = fromJS({ id: 'a', type: 'textinformation' });
    const state = responses({
      index: 0,
      items: fromJS({ [questionnaireId]: {
        id: questionnaireId,
        answeredQuestions: [
          { id: 1, elementId: 'a', viewed: true, answers: [] },
          { id: 2, viewed: true, answers: [] },
          { id: 3, viewed: true, answers: [] },
          { id: 4, viewed: true, answers: [] }
      ]}})
    }, nextQuestion({ element }));
    expect(state.index).toBe(1);
  });

  it('duplicates response elements if skip logic points back', () => {
    const questionnaireId = 'abcd';
    const element = fromJS({
      id: 500,
      type: 'radio',
      answers: [{ id: 100, goTo: { id: 200 }}]
    });
    const state = responses({
      index: 2,
      items: fromJS({ [questionnaireId]: {
        id: questionnaireId,
        answeredQuestions: [
          { id: 1, elementId: 200, viewed: true, answers: [] },
          { id: 2, viewed: true, answers: [] },
          { id: 3, elementId: 500, viewed: true, answers: [{ id: 100 }] },
          { id: 4, viewed: true, answers: [] }
      ]}})
    }, nextQuestion({ element }));
    expect(state.items.getIn([questionnaireId, 'answeredQuestions']).size).toEqual(7);
  });
})

describe('getVisibleResponseElements', () => {
  it('returns empty array if no current response', () => {
    const state = {
      index: 2,
      items: fromJS({})
    };
    const visibleQuestions = getVisibleResponseElements(state);
    expect(visibleQuestions).toEqual(fromJS([]));
  })
  it('gets all viewed questions before the current index', () => {
    const questionnaireId = 'abcd';
    const state = {
      index: 2,
      items: fromJS({ [questionnaireId]: {
        id: questionnaireId,
        answeredQuestions: [
          { id: 1, viewed: true},
          { id: 2, viewed: false },
          { id: 3, viewed: true },
          { id: 4, viewed: false }
      ]}})
    };
    const visibleQuestions = getVisibleResponseElements(state);
    expect(visibleQuestions).toEqual(fromJS([
      { id: 1, viewed: true },
      { id: 3, viewed: true }
    ]))
  })
})
