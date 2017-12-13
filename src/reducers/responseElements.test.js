import { fromJS } from 'immutable';
import { byId } from './responseElements';

const responseElementId = '1';
const answerId = '1';
const elementId = '1';
const ResponseElementMatrix = fromJS({
  entities: {
    responsesElements: {
      allIds: [responseElementId],
      byId: {
        [responseElementId]: {
          id: responseElementId,
          answers: [answerId],
          elementId: elementId,
          type: 'matrix'
        }
      }
    }
  }
});

describe('Matrix', () => {
  it('ById select answer', () => {
    const result = fromJS({
      [responseElementId]: {
        id: responseElementId,
        answers: [answerId],
        elementId: elementId,
        type: 'matrix'
      }
    });
    expect(
      byId(
        ResponseElementMatrix.getIn(['entities', 'responsesElements', 'byId']),
        {
          type: 'SELECT_ANSWER_MATRIX',
          payload: {
            entities: {
              responseElementAnswers: {
                [answerId]: {
                  id: answerId
                }
              }
            },
            result: answerId
          },
          responseElementId: responseElementId,
          matrixAnswers: [answerId]
        }
      )
    ).toEqual(result);
  });

  it('ById select answer with existing answer', () => {
    const result = fromJS({
      [responseElementId]: {
        id: responseElementId,
        answers: ['0'],
        elementId: elementId,
        type: 'matrix'
      }
    });
    expect(
      byId(
        ResponseElementMatrix.getIn(['entities', 'responsesElements', 'byId']),
        {
          type: 'SELECT_ANSWER_MATRIX',
          payload: {
            entities: {
              responseElementAnswers: {
                '0': {
                  id: '0'
                }
              }
            },
            result: '0'
          },
          responseElementId: responseElementId,
          matrixAnswers: fromJS([answerId])
        }
      )
    ).toEqual(result);
  });
});
