import React, { Component } from 'react';
import get from 'lodash.get';
class Text extends Component {
  render() {
    const {
      responseElement,
      answers,
      setAnswerValue,
      responseElementAnswers
    } = this.props;
    return (
      <div>
        <textarea
          disabled={responseElement.preferNotToAnswer}
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
