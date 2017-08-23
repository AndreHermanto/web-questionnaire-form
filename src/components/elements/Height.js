import React, { Component } from 'react';
import get from 'lodash.get';
class Height extends Component {
  render() {
    const { answers, setAnswerValue, responseElementAnswers } = this.props;
    return (
      <div>
        <input
          type="text"
          placeholder="feet"
          className="form-control"
          value={get(responseElementAnswers, `${answers[0].id}.feet`, '')}
          onChange={e => setAnswerValue(answers[0].id, 'feet', e.target.value)}
        />
        <input
          type="text"
          placeholder="inches"
          className="form-control"
          value={get(responseElementAnswers, `${answers[0].id}.inches`, '')}
          onChange={e =>
            setAnswerValue(answers[0].id, 'inches', e.target.value)}
        />
      </div>
    );
  }
}

export default Height;
