import React, { Component } from 'react';
import get from 'lodash.get';
class Text extends Component {
  render() {
    const { answers, setAnswerValue, responseElementAnswers } = this.props;
    return (
      <div>
        <textarea
          type="text"
          className="form-control"
          value={get(responseElementAnswers, `${answers[0].id}.text`, '')}
          onChange={e => setAnswerValue(answers[0].id, 'text', e.target.value)}
        />
      </div>
    );
  }
}

export default Text;
