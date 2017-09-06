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
      largeText,
      onNoneOfTheAboveToAnswer
    } = this.props;
    const checkNoneOfTheAbove =
      answers[answers.length - 1].text.toLowerCase() === 'none of the above';
    return (
      <CheckboxContainer largeText={largeText}>
        <ul className="list-unstyled">
          {answers.map(answer =>
            <div key={answer.id}>
              {checkNoneOfTheAbove
                ? <li key={answer.id}>
                    {answer.text.toLowerCase() !== 'none of the above'
                      ? <div>
                          <CheckboxBootstrap
                            onChange={() => {
                              if (
                                get(
                                  responseElementAnswers,
                                  answers[answers.length - 1].id,
                                  false
                                )
                              ) {
                                onNoneOfTheAboveToAnswer(
                                  answers[answers.length - 1].id
                                );
                              }
                              toggleAnswer(answer.id);
                            }}
                            checked={get(
                              responseElementAnswers,
                              answer.id,
                              false
                            )}
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
                                onChange={e =>
                                  onFollowUpChanged(answer.id, e.target.value)}
                                className="form-control"
                                value={get(
                                  responseElementAnswers,
                                  `${answer.id}.followUp.text`,
                                  ''
                                )}
                              />
                            </div>}
                        </div>
                      : <div>
                          <CheckboxBootstrap
                            onChange={() => {
                              onNoneOfTheAboveToAnswer(answer.id);
                            }}
                            checked={get(
                              responseElementAnswers,
                              answer.id,
                              false
                            )}
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
                                onChange={e =>
                                  onFollowUpChanged(answer.id, e.target.value)}
                                className="form-control"
                                value={get(
                                  responseElementAnswers,
                                  `${answer.id}.followUp.text`,
                                  ''
                                )}
                              />
                            </div>}
                        </div>}
                  </li>
                : <li key={answer.id}>
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
                          onChange={e =>
                            onFollowUpChanged(answer.id, e.target.value)}
                          className="form-control"
                          value={get(
                            responseElementAnswers,
                            `${answer.id}.followUp.text`,
                            ''
                          )}
                        />
                      </div>}
                  </li>}
            </div>
          )}
        </ul>
      </CheckboxContainer>
    );
  }
}

export default Checkbox;
