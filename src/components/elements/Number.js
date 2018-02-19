import React, { Component } from 'react';
import get from 'lodash.get';
import jsonLogic from 'json-logic-js';
import { convertJsonLogicToText } from '../../helpers/questions';
class Number extends Component {
  renderValidation = (answers, number) => {
    const validationLogic = get(answers, '0.validationLogic.number', false);
    if (!validationLogic) {
      return false;
    }
    const isValid = jsonLogic.apply(validationLogic, {
      number: parseInt(number, 10)
    });
    if (isValid) {
      return null;
    }
    if (!number || !number.length) {
      return null;
    }
    return (
      <div className="text-danger">
        Please make sure your answer is:{' '}
        {convertJsonLogicToText(validationLogic)}
      </div>
    );
  };
  render() {
    const {
      answers,
      setAnswerValue,
      responseElementAnswers,
      responseElement
    } = this.props;
    const number = get(responseElementAnswers, `${answers[0].id}.number`, '');
    return (
      <div>
        <input
          type="number"
          className="form-control"
          value={number}
          onChange={e =>
            setAnswerValue(answers[0].id, 'number', e.target.value)}
          onKeyDown={e => {
            //don't let user enter -,+,., e
            if (
              e.keyCode === 189 ||
              e.keyCode === 187 ||
              e.keyCode === 190 ||
              e.keyCode === 69
            ) {
              e.preventDefault();
            }
          }}
        />
        {!responseElement.preferNotToAnswer &&
          this.renderValidation(answers, number)}
      </div>
    );
  }
}

export default Number;
