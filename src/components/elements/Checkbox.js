import React, { Component } from 'react';
import { Checkbox as CheckboxBootstrap } from 'react-bootstrap';
import styled from 'styled-components';
import get from 'lodash.get';
import Markdown from 'react-markdown';

const CheckboxContainer = styled.div`
  input[type="checkbox"] {
    margin-top: ${props =>
      props.largeText === 0 ? '' : props.largeText > 1 ? '20px' : '10px'};
  }
`;
class Checkbox extends Component {
  render() {
    const {
      answers,
      responseElementAnswers,
      toggleAnswer,
      onFollowUpChanged,
      largeText
    } = this.props;
    return (
      <CheckboxContainer largeText={largeText}>
        <ul className="list-unstyled">
          {answers.map(answer =>
            <li key={answer.id}>
              <CheckboxBootstrap
                onChange={() => toggleAnswer(answer.id)}
                checked={get(responseElementAnswers, answer.id, false)}
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {
                  <Markdown
                    source={answer.text}
                    escapeHtml={true}
                    skipHtml={true}
                  />
                }
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
      </CheckboxContainer>
    );
  }
}

export default Checkbox;
