import { fromJS } from 'immutable';
import responses, {
  getCurrentResponse,
  getVisibleResponseElements,
  isLastQuestion,
  getLogicStatement
} from './responses';
import {
  resumeQuestionnaire,
  previousQuestion,
  nextQuestion
} from '../actions';

test('responses exists', () => {
  expect(!!responses).toBe(true);
});

describe('isLastQuestion', () => {
  it('is true if we are on the actual last question', () => {
    const questionnaireId = 'abcd';
    const state = {
      index: 1,
      items: fromJS({ [questionnaireId]: {
        id: questionnaireId,
        answeredQuestions: [
          { id: 1, viewed: true },
          { id: 2, viewed: true }
        ]
      }})
    };
    expect(isLastQuestion(state, {})).toBe(true);
  });
  it('is false if we are not on the actual last question, and there is no skip logic', () => {
    const questionnaireId = 'abcd';
    const state = {
      index: 0,
      items: fromJS({ [questionnaireId]: {
        id: questionnaireId,
        answeredQuestions: [
          { id: 1, viewed: true, elementId: 'sdfg', answers: [] },
          { id: 2, viewed: true }
        ]
      }})
    };
    expect(isLastQuestion(state, fromJS({ id: 'sdfg' }))).toBe(false);
  });
  it('is true if a "go to end" answer is selected', () => {
    const questionnaireId = 'abcd';
    const element = fromJS({ id: 'sdfg', type: 'radio', answers: [{ id: 100, goTo: { id: 'End' } }]})
    const state = {
      index: 0,
      items: fromJS({ [questionnaireId]: {
        id: questionnaireId,
        answeredQuestions: [
          { id: 1, viewed: true, elementId: 'sdfg', answers: [{ id: 100 }]},
          { id: 2, viewed: true }
        ]
      }})
    };
    expect(isLastQuestion(state, element)).toBe(true);
  });

  it('is false if answer has skip logic, but not "go to end"', () => {
    const questionnaireId = 'abcd';
    const element = fromJS({ id: 'sdfg', answers: [{ id: 100, goTo: { id: '1232112' } }]})
    const state = {
      index: 0,
      items: fromJS({ [questionnaireId]: {
        id: questionnaireId,
        answeredQuestions: [
          { id: 1, viewed: true, elementId: 'sdfg', answers: [{ id: 100 }]},
          { id: 2, viewed: true }
        ]
      }})
    };
    expect(isLastQuestion(state, element)).toBe(false);
  });
})

describe('resuming a questionnaire', () => {
  it('goes to first question and marks it as viewed if the user hasnt started yet', () => {
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
  it('goes forward until it finds a visible question', () => {
    const questionnaireId = 'abcd';
    const element = fromJS({ answers: [{ id: '1231', goTo: { id: 10 } }]})
    const state = responses({
      index: 0,
      currentId: questionnaireId,
      items: fromJS({ [questionnaireId]: {
        id: questionnaireId,
        answeredQuestions: [
          {
            id: '1',
            viewed: true,
            elementId: '100',
            answers: [ { id: '1001' }] },
          {
            id: '2',
            viewed: false,
            elementId: '200',
            logic: '{what is your gender - male / 100 1000}',
            answers: []
          },
          {
            id: '3',
            viewed: false,
            elementId: '300',
            logic: '{what is your gender - female / 100 1001}',
            answers: []
          },
          {
            id: '3',
            viewed: false,
            elementId: '300',
            answers: []
          }
      ]}})
    }, nextQuestion({ element }));
    expect(state.index).toBe(2);
  })
  it('marks the next question as viewed', () => {
    const questionnaireId = 'abcd';
    const element = fromJS({ answers: [{ id: 100, goTo: { id: 10 } }]})
    const state = responses({
      index: 0,
      currentId: questionnaireId,
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
  });

  it('just goes forward if heading', () => {
    const questionnaireId = 'abcd';
    const element = fromJS({ id: 'a', type: 'section' });
    const state = responses({
      index: 0,
      currentId: questionnaireId,
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
      currentId: questionnaireId,
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
      currentId: questionnaireId,
      items: fromJS({ [questionnaireId]: {
        id: questionnaireId,
        answeredQuestions: [
          { id: 1, elementId: 200, viewed: true, answers: [] },
          { id: 2, viewed: true, answers: [] },
          { id: 3, elementId: 500, viewed: true, answers: [{ id: 100, loopBackTo: 200 }] },
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
  it('gets all questions that are visible', () => {
    const questionnaireId = 'abcd';
    const state = {
      index: 2,
      items: fromJS({ [questionnaireId]: {
        id: questionnaireId,
        answeredQuestions: [
          { id: 1, visible: true },
          { id: 2, visible: false },
          { id: 3, visible: true },
          { id: 4, visible: false }
      ]}})
    };
    const visibleQuestions = getVisibleResponseElements(state);
    expect(visibleQuestions).toEqual(fromJS([
      { id: 1, visible: true },
      { id: 3, visible: true }
    ]))
  })
})


describe('visibility', () => {
  const responseElements = fromJS([
    {
      id: '1',
      viewed: true,
      elementId: '100',
      answers: [{ id: '1001' }]
    },
    {
      id: '2',
      viewed: false,
      elementId: '200',
      answers: [{ id: '2000' }]
    },
    {
      id: '3',
      viewed: false,
      elementId: '300',
      answers: []
    },
    {
      id: '4',
      viewed: false,
      elementId: '300',
      answers: []
    },
    {
      id: '5',
      viewed: true,
      elementId: '100',
      answers: [{ id: '1000' }]
    },
    {
      id: '6',
      viewed: true,
      elementId: '600',
      answers: []
    }
  ]);

  it('works out the visibility based on previous answers', () => {
    const logicStatement = getLogicStatement(
      '{what is your gender - female / 100 1001} && {do you like cake - yes / 200 2000}',
      responseElements,
      3
    );
    expect(logicStatement).toEqual('true && true')
    const logicStatement2 = getLogicStatement(
      '{what is your gender - male / 100 1000} && {do you like cake - yes / 200 2000}',
      responseElements,
      3
    );
    expect(logicStatement2).toEqual('false && true');
  });
  it('uses the last answer that matched before this question', () => {
    // this is so any repeats, it wont take the first repeated elementId
    // it will take the last one
    const logicStatement3 = getLogicStatement(
      '{what is your gender - male / 100 1000}',
      responseElements,
      5
    );
    expect(logicStatement3).toEqual('true');
  });
})
