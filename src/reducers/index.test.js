import { fromJS } from 'immutable';
import * as selectors from './index';

describe('getIsShowingSubmitModal', () => {
  it('should return the value', () => {
    const result = selectors.getIsShowingSubmitModal(
      fromJS({
        ui: {
          isShowingSubmissionConfirmation: true
        }
      })
    );
    expect(result).toBe(true);
  });
});
describe('getVisibleResponseElementIds', () => {
  it('should work', () => {
    const responseId = '1';
    const responseElementIds = selectors.getVisibleResponseElementIds(
      fromJS({
        ui: {
          responseId
        },
        entities: {
          responses: {
            byId: {
              [responseId]: {
                answeredQuestions: ['1', '2', '3']
              }
            }
          },
          elements: {
            byId: {
              '1': { question: 'hello' },
              '2': { question: 'world', logic: '{/ 1 2}' }, // show if element 1 answer 1 is selected
              '3': { question: 'world', logic: '{/ 1 1}' } // show if element 1 answer 1 is selected
            }
          },
          responseElements: {
            byId: {
              '1': { id: '1', elementId: '1', answers: ['1'] },
              '2': { id: '2', logic: '{/ 1 2}', elementId: '2' },
              '3': { id: '3', logic: '{/ 1 1}', elementId: '3' }
            }
          },
          responseElementAnswers: {
            byId: {}
          }
        }
      })
    );
    expect(responseElementIds).toEqual(fromJS(['1', '3']));
  });
});

describe('getResponseElementIds', () => {
  it('should work', () => {
    const responseId = '1';
    const responseElementIds = selectors.getResponseElementIds(
      fromJS({
        ui: {
          responseId
        },
        entities: {
          responses: {
            byId: {
              [responseId]: {
                answeredQuestions: [1, 2, 3]
              }
            }
          }
        }
      })
    );
    expect(responseElementIds).toEqual(fromJS([1, 2, 3]));
  });
});

describe('getResponseElementById', () => {
  it('should work', () => {
    const responseElementId = '1';
    const responseElement = fromJS({ id: responseElementId });
    const state = fromJS({
      entities: {
        responseElements: {
          byId: {
            [responseElementId]: responseElement
          }
        }
      }
    });
    const result = selectors.getResponseElementById(state, responseElementId);
    expect(result).toEqual(responseElement);
  });
});

describe('getElementById', () => {
  it('should work', () => {
    const elementId = '1';
    const element = fromJS({ id: elementId });
    const state = fromJS({
      entities: {
        elements: {
          byId: {
            [elementId]: element
          }
        }
      }
    });
    const result = selectors.getElementById(state, elementId);
    expect(result).toEqual(element);
  });
});

describe('getAnswerById', () => {
  it('should work', () => {
    const answerId = '1';
    const answer = fromJS({ id: answerId });
    const state = fromJS({
      entities: {
        answers: {
          byId: {
            [answerId]: answer
          }
        }
      }
    });
    const result = selectors.getAnswerById(state, answerId);
    expect(result).toEqual(answer);
  });
});

describe('getResponseElementAnswersById', () => {
  it('should work', () => {
    const responseElementAnswerId = '1';
    const responseElementAnswer = fromJS({ id: responseElementAnswerId });
    const state = fromJS({
      entities: {
        responseElementAnswers: {
          byId: {
            [responseElementAnswerId]: responseElementAnswer
          }
        }
      }
    });
    const result = selectors.getResponseElementAnswersById(
      state,
      responseElementAnswerId
    );
    expect(result).toEqual(responseElementAnswer);
  });
});

describe('getEndPageMessage', () => {
  it('should get the end page element for a response', () => {
    const responseId = '1';
    const state = fromJS({
      entities: {
        responses: {
          byId: {
            [responseId]: {
              answeredQuestions: ['1']
            }
          }
        },
        responseElements: {
          byId: {
            '1': {
              id: '1',
              elementId: '1'
            }
          }
        },
        elements: {
          byId: {
            '1': {
              type: 'end',
              text: 'Thank you!'
            }
          }
        }
      }
    });
    const result = selectors.getEndPageMessage(state, responseId);
    expect(result).toEqual(
      fromJS({
        type: 'end',
        text: 'Thank you!'
      })
    );
  });
});

describe('getProgress', () => {
  it('gets the progress of the user', () => {
    const state = fromJS({
      ui: {
        responseId: '1'
      },
      entities: {
        responses: {
          byId: {
            '1': {
              answeredQuestions: ['1', '2']
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
            }
          }
        },
        elements: {
          byId: {
            '1': {
              type: 'radio'
            },
            '2': {
              type: 'section'
            }
          }
        }
      }
    });
    const result = selectors.getProgress(state, '1');
    expect(result).toBe(100);
  });
});

describe('getFullResponse', () => {
  it('puts together a full response document', () => {
    const responseId = '1';
    const state = fromJS({
      ui: {
        responseId
      },
      entities: {
        responses: {
          byId: {
            [responseId]: { id: responseId, answeredQuestions: ['1'] }
          }
        },
        responseElements: {
          byId: {
            '1': {
              id: '1',
              answers: ['1']
            }
          }
        },
        responseElementAnswers: {
          byId: {
            '1': {
              id: '1',
              text: 'hello'
            }
          }
        }
      }
    });
    const result = selectors.getFullResponse(state);
    expect(result).toEqual(
      fromJS({
        id: responseId,
        answeredQuestions: [{ id: '1', answers: [{ id: '1', text: 'hello' }] }]
      })
    );
  });
});

describe('get question number', () => {
  const responseElementId = '2';
  const state = fromJS({
    ui: {
      responseId: '1'
    },
    entities: {
      responses: {
        byId: {
          '1': { id: '1', answeredQuestions: ['1', '2', '3'] }
        }
      },
      responseElements: {
        byId: {
          '1': {
            id: '1',
            elementId: '1'
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
            id: '1',
            type: 'start'
          },
          '2': {
            id: '2',
            type: 'radio'
          },
          '3': {
            id: '3',
            elementId: 'checkbox'
          }
        }
      }
    }
  });

  it('returns the correct question number for the question', () => {
    expect(selectors.getQuestionNumber(state, responseElementId)).toBe(1);
  });
  it('returns null for non-questions', () => {
    expect(selectors.getQuestionNumber(state, '3')).toBe(null);
  });
});
