import { getCompletedQuestionnaires } from './questionnaires';

describe('getCompletedQuestionnaires', () => {
  it('should return default values for an empty array', () => {
    expect(getCompletedQuestionnaires([])).toEqual({
      all: true,
      beforePayment: true
    });
  });

  it('should return true for all and before payment if a single questionnaire is completed', () => {
    expect(
      getCompletedQuestionnaires([
        { response: { completed: true }, afterPayment: true }
      ])
    ).toEqual({
      all: true,
      beforePayment: true
    });
    expect(
      getCompletedQuestionnaires([
        { response: { completed: true }, afterPayment: false }
      ])
    ).toEqual({
      all: true,
      beforePayment: true
    });
  });

  it('should return false for all and before payment if a single questionnaire is not completed and doesn not require payment', () => {
    expect(
      getCompletedQuestionnaires([
        { response: { completed: false }, afterPayment: false }
      ])
    ).toEqual({
      all: false,
      beforePayment: false
    });
  });

  it('should return false for all and true for before payment if a single questionnaire is not completed but requires payment', () => {
    expect(
      getCompletedQuestionnaires([
        { response: { completed: false }, afterPayment: true }
      ])
    ).toEqual({
      all: false,
      beforePayment: true
    });
  });

  it('should return false for all and true for before payment if there are 2 questionnaires and uncompleted one requires payment', () => {
    expect(
      getCompletedQuestionnaires([
        { response: { completed: true }, afterPayment: false },
        { response: { completed: false }, afterPayment: true }
      ])
    ).toEqual({
      all: false,
      beforePayment: true
    });
  });

  it('should return false for all and before payment if there are 2 uncompleted questionnaires and one requires payment', () => {
    expect(
      getCompletedQuestionnaires([
        { response: { completed: false }, afterPayment: false },
        { response: { completed: false }, afterPayment: true }
      ])
    ).toEqual({
      all: false,
      beforePayment: false
    });
  });

  it('should return false for all and before payment if there are 2 uncompleted questionnaires and the one that requires payment missing response', () => {
    expect(
      getCompletedQuestionnaires([
        { response: { completed: false }, afterPayment: false },
        { afterPayment: true }
      ])
    ).toEqual({
      all: false,
      beforePayment: false
    });
  });
});
