import React, { Component } from 'react';
import get from 'lodash.get';
class Height extends Component {
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
          disabled={responseElement.preferNotToAnswer}
          type="text"
          placeholder="feet"
          className="form-control"
          value={get(responseElementAnswers, `${answers[0].id}.text`, '')}
          onChange={e => setAnswerValue(answers[0].id, 'feet', e.target.value)}
        />
        <input
          disabled={responseElement.preferNotToAnswer}
          type="text"
          placeholder="inches"
          className="form-control"
          value={responseElementAnswers[answers[0].id].inches}
          onChange={e =>
            setAnswerValue(answers[0].id, 'inches', e.target.value)}
        />
      </div>
    );
  }
}

export default Height;
