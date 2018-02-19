import React, { Component } from 'react';
import get from 'lodash.get';
import jsonLogic from 'json-logic-js';
import { convertJsonLogicToText } from '../../helpers/questions';
class Uoms extends Component {
  renderValidation = (answers, uom, unit) => {
    const validationLogic = get(answers, `0.validationLogic.${unit}`, false);
    if (!validationLogic) {
      return false;
    }
    const isValid = jsonLogic.apply(validationLogic, {
      [unit]: parseInt(uom, 10)
    });
    if (isValid) {
      return null;
    }
    if (!uom || !uom.length) {
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
      responseElement,
      answers,
      setAnswerValue,
      responseElementAnswers
    } = this.props;
    const uom1 = get(responseElementAnswers, `${answers[0].id}.uom1`, '');
    const uom2 = get(responseElementAnswers, `${answers[0].id}.uom2`, '');
    return (
      <div>
        <div className="input-group" style={{ marginBottom: 10 }}>
          <input
            type="number"
            className="form-control"
            value={get(responseElementAnswers, `${answers[0].id}.uom1`, '')}
            onChange={e =>
              setAnswerValue(answers[0].id, 'uom1', e.target.value)}
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
          <span className="input-group-addon" id="basic-addon2">
            {answers[0].uom1.label}
          </span>
        </div>
        {!responseElement.preferNotToAnswer &&
          this.renderValidation(answers, uom1, 'uom1')}

        <div className="input-group" style={{ marginBottom: 10 }}>
          <input
            type="number"
            className="form-control"
            value={get(responseElementAnswers, `${answers[0].id}.uom2`, '')}
            onChange={e =>
              setAnswerValue(answers[0].id, 'uom2', e.target.value)}
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
          <span className="input-group-addon" id="basic-addon2">
            {answers[0].uom2.label}
          </span>
        </div>
        {!responseElement.preferNotToAnswer &&
          this.renderValidation(answers, uom2, 'uom2')}
      </div>
    );
  }
}

export default Uoms;
