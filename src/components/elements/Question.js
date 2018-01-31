import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Radio from './Radio';
import Checkbox from './Checkbox';
import Text from './Text';
import Date from './Date';
import Height from './Height';
import Weight from './Weight';
import Number from './Number';
import Uom from './Uom';
import Uoms from './Uoms';
import Checkmark from '../Checkmark';
import Markdown from 'react-markdown';
import Matrix from './Matrix';
import { Modal, Button } from 'react-bootstrap';

class Question extends Component {
  static propTypes: {
    responseElement: PropTypes.object.isRequired,
    element: PropTypes.object.isRequired,
    answers: PropTypes.array.isRequired,
    responseElementAnswers: PropTypes.object.isRequired,
    selectAnswer: PropTypes.func.isRequired,
    toggleAnswer: PropTypes.func.isRequired,
    setAnswerValue: PropTypes.func.isRequired,
    onPreferNotToAnswer: PropTypes.func.isRequired,
    onFollowUpChanged: PropTypes.func.isRequired,
    closePreferNotToAnswerModal: PropTypes.func.isRequired,
    openPreferNotToAnswerModal: PropTypes.func.isRequired,
    showPreferNotToAnswerModal: PropTypes.bool.isRequired
  };
  constructor(props) {
    super(props);
    this.renderElement = this.renderElement.bind(this);
  }
  renderElement() {
    const { element } = this.props;
    switch (element.type) {
      case 'radio':
        return <Radio {...this.props} />;
      case 'checkbox':
        return <Checkbox {...this.props} />;
      case 'text':
        return <Text {...this.props} />;
      case 'date':
        return <Date {...this.props} />;
      case 'height':
        return <Height {...this.props} />;
      case 'weight':
        return <Weight {...this.props} />;
      case 'number':
        return <Number {...this.props} />;
      case 'matrix':
        return <Matrix {...this.props} />;
      case 'uom':
        return <Uom {...this.props} />;
      case 'uoms':
        return <Uoms {...this.props} />;
      default:
        return (
          <div>
            Sorry, the question type {this.props.element.type} is not currently
            supported.
          </div>
        );
    }
  }
  render() {
    const isAnswered =
      (this.props.responseElement.answers.length ||
        this.props.responseElement.preferNotToAnswer) &&
      !this.props.isInvalid;
    return (
      <div
        className="question-container"
        style={{
          border: '1px solid #eee',
          marginBottom: 24,
          padding: 24,
          backgroundColor: 'white',
          borderColor: isAnswered ? 'green' : '#eee',
          position: 'relative'
        }}
      >
        {isAnswered && (
          <div style={{ float: 'right', marginTop: '-10px' }}>
            <Checkmark />
          </div>
        )}

        <div style={{ whiteSpace: 'pre-wrap', marginBottom: 10 }}>
          <Markdown
            source={`${this.props.questionNumber}\\. ${
              this.props.element.question
            }`}
            escapeHtml={true}
            skipHtml={true}
          />
        </div>
        {this.renderElement()}

        {!this.props.element.required && (
          <div>
            <div className="checkbox">
              <label style={{ color: 'black' }}>
                <input
                  type="checkbox"
                  checked={
                    this.props.responseElement.preferNotToAnswer === true
                  }
                  onChange={() => {
                    this.props.responseElement.preferNotToAnswer ||
                    !this.props.responseElement.answers.length
                      ? this.props.onPreferNotToAnswer()
                      : this.props.openPreferNotToAnswerModal(
                          this.props.responseElement.id
                        );
                  }}
                />{' '}
                Prefer not to answer
              </label>
            </div>
            <Modal
              show={
                this.props.showPreferNotToAnswerModal ===
                this.props.responseElement.id
              }
              onHide={this.props.closePreferNotToAnswerModal}
            >
              <Modal.Header closeButton>
                <Modal.Title>Confirmation Prefer Not To Answer</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>
                  You have selected prefer not to answer, which will delete your
                  answer.
                </p>
                <p>
                  If this was the action that you wanted to do, please confirm
                  your choice, or cancel and return to the page
                </p>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.props.closePreferNotToAnswerModal}>
                  Close
                </Button>
                <Button
                  bsStyle="danger"
                  onClick={() => {
                    this.props.onPreferNotToAnswer();
                    this.props.closePreferNotToAnswerModal();
                  }}
                >
                  Confirm
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        )}
        {this.props.element.required && (
          <div className="text-muted text-uppercase" style={{ fontSize: 10 }}>
            This question is required.
          </div>
        )}
      </div>
    );
  }
}

export default Question;
