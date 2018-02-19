import React, { Component } from 'react';
import get from 'lodash.get';
class Weight extends Component {
  render() {
    const { answers, setAnswerValue, responseElementAnswers } = this.props;
    return (
      <div>
        <input
          type="number"
          placeholder="pounds"
          className="form-control"
          value={get(responseElementAnswers, `${answers[0].id}.weight`, '')}
          onChange={e =>
            setAnswerValue(answers[0].id, 'weight', e.target.value)}
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
      </div>
    );
  }
}

export default Weight;
