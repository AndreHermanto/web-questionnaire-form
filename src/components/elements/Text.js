import React, { Component } from 'react';
import get from 'lodash.get';
import Textarea from 'react-textarea-autosize';

class Text extends Component {
  render() {
    const { answers, setAnswerValue, responseElementAnswers } = this.props;
    return (
      <div>
        <Textarea
          type="text"
          className="form-control"
          value={get(responseElementAnswers, `${answers[0].id}.text`, '')}
          onChange={e => setAnswerValue(answers[0].id, 'text', e.target.value)}
          style={{
            resize: 'vertical',
            boxShadow: 'none',
            padding: 15,
            minHeight: 100
          }}
        />
      </div>
    );
  }
}

export default Text;
