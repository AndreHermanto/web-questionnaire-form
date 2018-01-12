import React, { Component } from 'react';
import get from 'lodash.get';
class Uoms extends Component {
  render() {
    const { answers, setAnswerValue, responseElementAnswers } = this.props;
    return (
      <div>
        <input
          type="text"
          placeholder={answers[0].value1.uom.label}
          className="form-control"
          value={get(responseElementAnswers, `${answers[0].id}.value1`, '')}
          onChange={e =>
            setAnswerValue(answers[0].id, 'value1', e.target.value)}
          style={{ marginBottom: 10 }}
        />
        <input
          type="text"
          placeholder={answers[0].value2.uom.label}
          className="form-control"
          value={get(responseElementAnswers, `${answers[0].id}.value2`, '')}
          onChange={e =>
            setAnswerValue(answers[0].id, 'value2', e.target.value)}
        />
      </div>
    );
  }
}

export default Uoms;
