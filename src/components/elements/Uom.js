import React, { Component } from 'react';
import get from 'lodash.get';
import jsonLogic from 'json-logic-js';
class Uom extends Component {
  renderValidation = (answers, uom) => {
    const validationLogic = get(answers, '0.validationLogic.uom1', false);
    if (!validationLogic) {
      return false;
    }
    const isValid = jsonLogic.apply(validationLogic, {
      uom1: parseInt(uom, 10)
    });
    if (isValid) {
      return null;
    }
    if (!uom || !uom.length) {
      return null;
    }
    return (
      <div className="text-danger">Please make sure your answer is valid.</div>
    );
  };
  render() {
    const {
      responseElement,
      answers,
      setAnswerValue,
      responseElementAnswers
    } = this.props;
    const uom = get(responseElementAnswers, `${answers[0].id}.uom1`, '');
    return (
      <div>
        <div className="input-group" style={{ marginBottom: 10 }}>
          <input
            type="number"
            className="form-control"
            value={get(responseElementAnswers, `${answers[0].id}.uom1`, '')}
            onChange={e =>
              setAnswerValue(answers[0].id, 'uom1', e.target.value)}
          />
          <span className="input-group-addon" id="basic-addon2">
            {answers[0].uom1.label}
          </span>
        </div>
        {!responseElement.preferNotToAnswer &&
          this.renderValidation(answers, uom)}
      </div>
    );
  }
}

export default Uom;
