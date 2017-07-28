import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Radio from './Radio';
import Checkbox from './Checkbox';
import Text from './Text';
import Date from './Date';
import Height from './Height';
import Weight from './Weight';
import Number from './Number';

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
    onFollowUpChanged: PropTypes.func.isRequired
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

      default:
        return (
          <div>
            Sorry, the question type
            {' '}
            {this.props.element.type}
            {' '}
            is not currently supported.
          </div>
        );
    }
  }
  render() {
    return (
      <div
        style={{
          border: '1px solid #eee',
          marginBottom: 24,
          padding: 24,
          borderColor: this.props.responseElement.answers.length ||
            this.props.responseElement.preferNotToAnswer
            ? 'green'
            : '#eee',
          color: this.props.responseElement.preferNotToAnswer ? '#aaa' : '#333'
        }}
      >
        <div style={{ whiteSpace: 'pre-wrap' }}>
          <strong>{this.props.element.question}</strong>
        </div>
        {this.renderElement()}
        <Button
          bsSize="small"
          onClick={this.props.onPreferNotToAnswer}
          active={this.props.responseElement.preferNotToAnswer}
        >
          Prefer not to answer
        </Button>
      </div>
    );
  }
}

export default Question;
