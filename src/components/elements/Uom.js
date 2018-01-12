import React, { Component } from 'react';
import get from 'lodash.get';
class Uom extends Component {
  render() {
    const { answers, setAnswerValue, responseElementAnswers } = this.props;
    return (
      <div>
        <input
          type="number"
          placeholder={answers[0].value1.uom.label}
          className="form-control"
          value={get(responseElementAnswers, `${answers[0].id}.value1`, '')}
          onChange={e =>
            setAnswerValue(answers[0].id, 'value1', e.target.value)}
        />
      </div>
    );
  }
}

export default Uom;
