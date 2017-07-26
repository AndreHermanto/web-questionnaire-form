import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SectionHeading from './elements/SectionHeading';
import Question from './elements/Question';
import Intro from './elements/Intro';

class NewElement extends Component {
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
      case 'start':
        return <Intro {...this.props} />;
      case 'section':
        return <SectionHeading {...this.props} />;
      case 'radio':
      case 'checkbox':
      case 'text':
      case 'date':
      case 'height':
      case 'weight':
        return <Question {...this.props} />;
      default:
        return (
          <div>
            {this.props.responseElementId} hell owrld!
            <h3>response element</h3>
            {this.props.responseElement &&
              <div>
                <pre>
                  {JSON.stringify(this.props.responseElement, null, 2)}
                </pre>
              </div>}
            <h3>element</h3>
            <div>
              <pre>
                {JSON.stringify(this.props.element, null, 2)}
              </pre>
            </div>
            <h3>answers</h3>
            <div>
              <pre>
                {JSON.stringify(this.props.answers, null, 2)}
              </pre>
            </div>}
            <h3>response element answers</h3>
            <div>
              <pre>
                {JSON.stringify(this.props.responseElementAnswers, null, 2)}
              </pre>
            </div>
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
