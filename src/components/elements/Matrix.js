import React, { Component } from 'react';
import { Radio as RadioBootstrap } from 'react-bootstrap';
import styled from 'styled-components';
import get from 'lodash.get';
import Markdown from 'react-markdown';

const RadioContainer = styled.div`
  input[type='radio'] {
    margin-top: ${props =>
      props.largeText === 0 ? '' : props.largeText > 1 ? '20px' : '10px'};
  }
`;
class Matrix extends Component {
  render() {
    const {
      matrixAnswers,
      responseElementAnswers,
      selectAnswerMatrix,
      onFollowUpChanged,
      largeText,
      matrixElements
    } = this.props;
    return (
      <RadioContainer largeText={largeText}>
        <ul className="list-unstyled">
          {matrixElements.map((matrix, i) => (
            <div key={matrix.id}>
              <div>{matrix.question}</div>
              {matrixAnswers[i].map((answer, j) => {
                return (
                  <li key={answer.id}>
                    <RadioBootstrap
                      checked={get(responseElementAnswers, answer.id, false)}
                      onChange={() => selectAnswerMatrix(answer.id)}
                      style={{ whiteSpace: 'pre-wrap' }}
                    >
                      {
                        <Markdown
                          source={answer.text}
                          escapeHtml={true}
                          skipHtml={true}
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

                    {answer.image && (
                      <img
                        src={answer.image}
                        alt="introduction"
                        className="img-responsive"
                      />
                    )}
                  </li>
                );
              })}
            </div>
          ))}
        </ul>
      </RadioContainer>
    );
  }
}

export default Matrix;
