import React, { Component } from 'react';
import get from 'lodash.get';
class Weight extends Component {
  render() {
    const {
      responseElement,
      answers,
      setAnswerValue,
      responseElementAnswers
    } = this.props;
    return (
      <div>
        <input
          type="number"
          placeholder="pounds"
          className="form-control"
          value={get(responseElementAnswers, `${answers[0].id}.weight`, '')}
          onChange={e => setAnswerValue(answers[0].id, 'feet', e.target.value)}
        />
      </div>
    );
  }
}

export default Weight;
