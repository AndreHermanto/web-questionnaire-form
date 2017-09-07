import React, { Component } from 'react';
import { Checkbox as CheckboxBootstrap, Modal, Button } from 'react-bootstrap';
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
      responseElement,
      responseElementAnswers,
      toggleAnswer,
      onFollowUpChanged,
      largeText,
      onNoneOfTheAboveToAnswer,
      openNoneOfTheAboveAnswerModal,
      closeNoneOfTheAboveAnswerModal,
      showNoneOfTheAboveAnswerModal
    } = this.props;
    const checkNoneOfTheAbove =
      answers[answers.length - 1].text.toLowerCase() === 'none of the above';
    return (
      <CheckboxContainer largeText={largeText}>
        <ul className="list-unstyled">
          {answers.map((answer, index) =>
            <li key={answer.id}>
              <CheckboxBootstrap
                onChange={() => {
                  if (checkNoneOfTheAbove) {
                    if (
                      index === answers.length - 1 &&
                      answer.text.toLowerCase() === 'none of the above'
                    ) {
                      if (
                        responseElement.answers.length &&
                        responseElement.answers[0] !== answer.id
                      ) {
                        openNoneOfTheAboveAnswerModal();
                      } else {
                        onNoneOfTheAboveToAnswer(answer.id);
                      }
                    } else {
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
                    }
                  } else {
                    toggleAnswer(answer.id);
                  }
                }}
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
              <Modal
                show={showNoneOfTheAboveAnswerModal === responseElement.id}
                onHide={closeNoneOfTheAboveAnswerModal}
              >
                <Modal.Header closeButton>
                  <Modal.Title>
                    Confirmation to answer 'None of the above'
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p>
                    You have selected 'None of the above' answer, which will
                    delete your previous answer.
                  </p>
                  <p>
                    If this was the action that you wanted to do, please confirm
                    your choice, or cancel and return to the page
                  </p>
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={closeNoneOfTheAboveAnswerModal}>
                    Close
                  </Button>
                  <Button
                    bsStyle="danger"
                    onClick={() => {
                      onNoneOfTheAboveToAnswer(answer.id);
                      closeNoneOfTheAboveAnswerModal();
                    }}
                  >
                    Confirm
                  </Button>
                </Modal.Footer>
              </Modal>
            </li>
          )}
        </ul>
      </CheckboxContainer>
    );
  }
}

export default Checkbox;
