import React, { Component } from 'react';
import { Radio as RadioBootstrap } from 'react-bootstrap';
import get from 'lodash.get';
class Radio extends Component {
  render() {
    const {
      responseElement,
      answers,
      responseElementAnswers,
      selectAnswer,
      onFollowUpChanged,
      onPreferNotToAnswer
    } = this.props;
    return (
      <div>
        <ul className="list-unstyled">
          {answers.map(answer =>
            <li key={answer.id}>
              <RadioBootstrap
                checked={get(responseElementAnswers, answer.id, false)}
                onChange={() => {
                  selectAnswer(answer.id);
                  if (responseElement.preferNotToAnswer) {
                    onPreferNotToAnswer();
                  }
                }}
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {answer.text}
              </RadioBootstrap>
              {get(responseElementAnswers, answer.id, false) &&
                answer.followUp &&
                <div>
                  {answer.followUp.question}
                  <textarea
                    onChange={e => onFollowUpChanged(answer.id, e.target.value)}
                    className="form-control"
                    value={get(
                      responseElementAnswers,
                      `${answer.id}.followUp.text`,
                      ''
                    )}
                  />
                </div>}
            </li>
          )}
        </ul>
      </div>
    );
  }
}

export default Radio;
