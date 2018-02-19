import React, { Component } from 'react';
import get from 'lodash.get';
class Height extends Component {
  render() {
    const { answers, setAnswerValue, responseElementAnswers } = this.props;
    return (
      <div>
        <input
          type="number"
          placeholder="feet"
          className="form-control"
          value={get(responseElementAnswers, `${answers[0].id}.feet`, '')}
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
          onChange={e => setAnswerValue(answers[0].id, 'feet', e.target.value)}
          style={{ marginBottom: 10 }}
        />
        <input
          type="number"
          placeholder="inches"
          className="form-control"
          value={get(responseElementAnswers, `${answers[0].id}.inches`, '')}
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
          onChange={e =>
            setAnswerValue(answers[0].id, 'inches', e.target.value)}
        />
      </div>
    );
  }
}

export default Height;
