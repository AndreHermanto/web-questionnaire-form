import React, { Component } from 'react';
import { Radio as RadioBootstrap } from 'react-bootstrap';
import styled from 'styled-components';
import get from 'lodash.get';
import GlossaryAnnotator from './GlossaryAnnotator';

const RadioContainer = styled.div`
  input[type='radio'] {
    margin-top: ${props =>
      props.largeText === 0 ? '' : props.largeText > 1 ? '20px' : '10px'};
  }
`;
class Radio extends Component {
  render() {
    const {
      answers,
      responseElementAnswers,
      selectAnswer,
      onFollowUpChanged,
      largeText
    } = this.props;
    return (
      <RadioContainer largeText={largeText}>
        <ul className="list-unstyled">
          {answers.map(answer => (
            <li key={answer.id}>
              <RadioBootstrap
                checked={get(responseElementAnswers, answer.id, false)}
                onChange={() => selectAnswer(answer.id)}
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {
                  <GlossaryAnnotator
                    text={answer.text}
                    glossaryTermAnnotations={answer.glossaryTermAnnotations}
                  />
                }
              </RadioBootstrap>
              {get(responseElementAnswers, answer.id, false) &&
                answer.followUp && (
                  <div>
                    {answer.followUp.question}
                    <textarea
                      onChange={e =>
                        onFollowUpChanged(answer.id, e.target.value)}
                      className="form-control"
                      value={get(
                        responseElementAnswers,
                        `${answer.id}.followUp.text`,
                        ''
                      )}
                    />
                  </div>
                )}
            </li>
          ))}
        </ul>
      </RadioContainer>
    );
  }
}

export default Radio;
