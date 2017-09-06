import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SectionHeading from './elements/SectionHeading';
import TextInformation from './elements/TextInformation';
import Question from './elements/Question';
import Intro from './elements/Intro';

class NewElement extends Component {
  static propTypes: {
    responseElement: PropTypes.object.isRequired,
    element: PropTypes.object.isRequired,
    answers: PropTypes.array.isRequired,
    responseElementAnswers: PropTypes.object.isRequired,
    isInvalid: PropTypes.bool.isRequired,
    selectAnswer: PropTypes.func.isRequired,
    toggleAnswer: PropTypes.func.isRequired,
    setAnswerValue: PropTypes.func.isRequired,
    onPreferNotToAnswer: PropTypes.func.isRequired,
    onFollowUpChanged: PropTypes.func.isRequired,
    onNoneOfTheAboveToAnswer: PropTypes.func.isRequired
  };
  constructor(props) {
    super(props);
    this.renderElement = this.renderElement.bind(this);
  }
  renderElement() {
    const { element } = this.props;
    switch (element.type) {
      case 'start':
        return <Intro {...this.props} />;
      case 'section':
        return <SectionHeading {...this.props} />;
      case 'textinformation':
        return <TextInformation {...this.props} />;
      case 'radio':
      case 'checkbox':
      case 'text':
      case 'date':
      case 'height':
      case 'weight':
      case 'number':
        return <Question {...this.props} />;
      default:
        return (
          <div>
            Sorry, the element type {this.props.element.type} is not currently
            supported.
          </div>
        );
    }
  }
  render() {
    return (
      <div>
        {this.renderElement()}
      </div>
    );
  }
}

export default NewElement;
