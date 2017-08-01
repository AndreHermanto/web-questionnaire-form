import React, { Component } from 'react';
import { Checkbox as CheckboxBootstrap } from 'react-bootstrap';
import get from 'lodash.get';
class Checkbox extends Component {
  render() {
    const {
      responseElement,
      answers,
      responseElementAnswers,
      toggleAnswer,
      onFollowUpChanged
    } = this.props;
    return (
      <div>
        <ul className="list-unstyled">
          {answers.map(answer =>
            <li key={answer.id}>
              <CheckboxBootstrap
                onChange={() => toggleAnswer(answer.id)}
                checked={get(responseElementAnswers, answer.id, false)}
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {answer.text}
              </CheckboxBootstrap>
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

export default Checkbox;
