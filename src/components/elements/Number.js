import React, { Component } from 'react';
import get from 'lodash.get';
class Number extends Component {
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
        <input
          type="number"
          className="form-control"
          value={get(responseElementAnswers, `${answers[0].id}.number`, '')}
          onChange={e => {
            setAnswerValue(answers[0].id, 'number', e.target.value);
            if (responseElement.preferNotToAnswer) {
              onPreferNotToAnswer();
            }
          }}
        />
      </div>
    );
  }
}

export default Number;
