import React, { Component } from 'react';
import get from 'lodash.get';
class Text extends Component {
  render() {
    const {
      responseElement,
      answers,
      setAnswerValue,
      responseElementAnswers,
      onPreferNotToAnswer
    } = this.props;
    return (
      <div>
        <textarea
          type="text"
          className="form-control"
          value={get(responseElementAnswers, `${answers[0].id}.text`, '')}
          onChange={e => {
            setAnswerValue(answers[0].id, 'text', e.target.value);
            if (responseElement.preferNotToAnswer) {
              onPreferNotToAnswer();
            }
          }}
        />
      </div>
    );
  }
}

export default Text;
