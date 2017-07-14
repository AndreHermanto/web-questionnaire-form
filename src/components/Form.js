import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StartEndText from '../components/StartEndText';
import Question from '../components/Question';
import TextInformation from '../components/TextInformation';
import Heading from '../components/Heading';
import ProgressBar from '../components/ProgressBar';

const NextButton = props => {
  const { isRequired, answerSize, nextQuestion } = props;
  if (isRequired) {
    if (answerSize) {
      return (
        <button className="btn btn-primary btn-lg" onClick={nextQuestion}>
          Next
        </button>
      );
    } else {
      return null;
    }
  } else {
    return (
      <button className="btn btn-primary btn-lg" onClick={nextQuestion}>
        {answerSize ? 'Next' : 'Prefer not to answer'}
      </button>
    );
  }
};
class Form extends Component {
  static propTypes: {
    nextQuestion: PropTypes.func.isRequired,
    submitQuestionnaire: PropTypes.func.isRequired
  };
  renderButton(isRequired, answerSize) {}
  render() {
    if (!this.props.version || !this.props.response) {
      return <div className="container">Loading...</div>;
    }
    const { submitQuestionnaire, nextQuestion } = this.props;
    return (
      <div className="container">
        {this.props.version &&
          <div>
            <h1 className="text-capitalize">
              {this.props.version.get('title')}
            </h1>
          </div>}
        {this.props.visibleQuestions.map((visibleQuestion, index) => {
          const { element, responseElement } = visibleQuestion;
          if (!element || !responseElement) {
            return <div>Loading question and reponse...</div>;
          }

          // START PAGE
          if (element.get('type') === 'start') {
            return (
              <div
                style={{
                  marginBottom: 24,
                  backgroundColor: 'white',
                  border: '1px solid #eee',
                  padding: 32
                }}
              >
                <StartEndText
                  text={element.get('text')}
                  fontSize={element.get('fontSize')}
                  color={element.get('color')}
                  isItalic={element.get('isItalic')}
                  isBold={element.get('isBold')}
                />
                {element.get('image') &&
                  <img
                    src={element.get('image')}
                    style={{ margin: 'auto' }}
                    alt=""
                    className="img-responsive"
                  />}
                {index === this.props.visibleQuestions.size - 1 &&
                  !this.props.isShowingSubmit &&
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={nextQuestion}
                  >
                    {element.get('buttonText')}
                  </button>}
              </div>
            );
          }
          if (element.get('type') === 'textinformation') {
            return (
              <div key={responseElement.get('id')}>
                <TextInformation
                  name={responseElement.get('id')}
                  text={element.get('text')}
                />
                {index === this.props.visibleQuestions.size - 1 &&
                  !this.props.isShowingSubmit &&
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={nextQuestion}
                  >
                    {responseElement.get('answers').size ? 'Next' : 'Skip'}
                  </button>}
              </div>
            );
          }

          // section heading
          if (element.get('type') === 'section') {
            return (
              <div key={responseElement.get('id')}>
                <Heading
                  text={element.get('title')}
                  size={element.get('size')}
                  name={responseElement.get('id')}
                />
                {index === this.props.visibleQuestions.size - 1 &&
                  !this.props.isShowingSubmit &&
                  <div style={{ width: '100%', height: '80px' }}>
                    <ProgressBar
                      completed={this.props.answeredQuestions.size}
                      total={this.props.questions.size}
                    />
                    <button
                      className="btn btn-primary btn-lg"
                      onClick={nextQuestion}
                    >
                      Okay
                    </button>
                  </div>}
              </div>
            );
          }

          return (
            <div key={responseElement.get('id')}>
              <Question
                name={responseElement.get('id')}
                key={visibleQuestion.responseElement.get('id')}
                element={element}
                number={index + 1}
                responseElement={responseElement}
                onAnswer={this.props.onQuestionAnswered}
                showlogic={this.props.debug}
                onMatrixAnswerClicked={this.props.onMatrixAnswerClicked}
              />
              {index === this.props.visibleQuestions.size - 1 &&
                !this.props.isShowingSubmit &&
                <div style={{ width: '100%', height: '80px' }}>
                  <ProgressBar
                    completed={this.props.answeredQuestions.size}
                    total={this.props.questions.size}
                  />
                  <NextButton
                    isRequired={element.get('required')}
                    answerSize={responseElement.get('answers').size}
                    nextQuestion={nextQuestion}
                  />
                </div>}
            </div>
          );
        })}

        {this.props.isShowingSubmit &&
          <div style={{ width: '100%', height: '80px' }}>
            <ProgressBar
              completed={this.props.answeredQuestions.size}
              total={this.props.questions.size}
            />
            <button
              className="btn btn-primary btn-lg"
              onClick={submitQuestionnaire}
            >
              Submit
            </button>
          </div>}
      </div>
    );
  }
}

export default Form;
