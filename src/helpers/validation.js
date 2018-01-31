import moment from 'moment';
import jsonLogic from 'json-logic-js';

export const isDateAnswerInvalid = (responseElement, responseElementAnswer) => {
  // keep invalid dates
  return (
    !responseElementAnswer.get('year') ||
    responseElementAnswer.get('year') < 1900 ||
    responseElementAnswer.get('year') > 2100 ||
    responseElementAnswer.get('year').length !== 4 ||
    !responseElementAnswer.get('day') ||
    responseElementAnswer.get('day').length === 0 ||
    !responseElementAnswer.get('month') ||
    responseElementAnswer.get('month').length === 0 ||
    responseElementAnswer.get('day') > 31 ||
    responseElementAnswer.get('day') <= 0 ||
    !moment(
      `${responseElementAnswer.get('year')}-${responseElementAnswer.get(
        'month'
      )}-${responseElementAnswer.get('day')}`,
      'YYYY-MM-DD'
    ).isValid()
  );
};

export const isNumberAnswerInvalid = (
  responseElement,
  responseElementAnswer
) => {
  const number = responseElementAnswer.get('number');
  const validationLogic = responseElementAnswer.getIn([
    'validationLogic',
    'number'
  ]);
  if (!validationLogic) {
    return false;
  }
  const isValid = jsonLogic.apply(validationLogic, {
    number: parseInt(number, 10)
  });
  return !isValid;
};
