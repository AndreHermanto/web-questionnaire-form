import React, { Component } from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import { scroller } from 'react-scroll';
import {
  setupQuestionnaire,
  nextQuestion,
  setQuestionnaireDebug,
  setQuestionAnswer,
  setMatrixQuestionAnswer,
  setResponseSubmitted
} from '../actions';
import StartEndText from '../components/StartEndText';
import Question from '../components/Question';
import TextInformation from '../components/TextInformation';
import {
  getVisibleQuestions,
  isLastQuestion,
  isFirstQuestion,
  getCurrentResponse,
  getCurrentVersion,
  getAnsweredQuestions,
  getQuestions,
  getDebug
} from '../reducers';
import Heading from '../components/Heading';
import ProgressBar from '../components/ProgressBar';

class QuestionnaireFormContainer extends Component {
  constructor(props) {
    super(props);
    this.handleQuestionAnswered = this.handleQuestionAnswered.bind(this);
    this.setPageMode = this.setPageMode.bind(this);
    this.renderButton = this.renderButton.bind(this);
  }

  setPageMode() {
    if (this.props.location.query.showlogic === 'true') {
      this.props.dispatch(setQuestionnaireDebug(true));
    } else {
      this.props.dispatch(setQuestionnaireDebug(false));
    }
  }

  componentWillMount() {
    this.setPageMode();
  }

  componentDidMount() {
    const { questionnaireId, userId } = this.props.params;
    const resume = this.props.location.query.resume === 'true';
    this.props.dispatch(
      setupQuestionnaire({
        questionnaireId,
        userId,
        resume
      })
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.visibleQuestions.size !== this.props.visibleQuestions.size) {
      scroller.scrollTo(
        this.props.visibleQuestions.last().responseElement.get('id'),
        {
          duration: 500,
          delay: 0,
          smooth: true
        }
      );
    }
  }

  handleQuestionAnswered(responseElement) {
    this.props.dispatch(setQuestionAnswer({ responseElement }));
  }

  handeSubmitQuestionnaire() {
    hashHistory.push(
      `/users/${this.props.params.userId}/questionnaires/${this.props.params.questionnaireId}/summary`
    );
  }

  renderButton(isRequired, answerSize) {
    if (isRequired) {
      if (answerSize) {
        return (
          <button
            className="btn btn-primary btn-lg"
            onClick={() => this.props.dispatch(nextQuestion())}
          >
            Next
          </button>
        );
      } else {
        return null;
      }
    } else {
      return (
        <button
          className="btn btn-primary btn-lg"
          onClick={() => this.props.dispatch(nextQuestion())}
        >
          {answerSize ? 'Next' : 'Prefer not to answer'}
        </button>
      );
    }
  }

  render() {
    if (!this.props.version || !this.props.response) {
      return <div className="container">Loading...</div>;
    }
    const { submitQuestionnaire } = this.props;
    return (
      <div className="container">
        {this.props.version &&
          <div>
            <h3 style={{ textAlign: 'center', 'letter-spacing': 1 }}>
              {this.props.version.get('title')}
            </h3>
            <hr style={{ borderColor: '#c9c9c9' }} />
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
                <div><pre>{JSON.stringify(element, null, 2)}</pre></div>;

                {element.get('image') &&
                  <img
                    src={element.get('image')}
                    style={{ margin: 'auto' }}
                    alt=""
                    className="img-responsive"
                  />}
                <StartEndText
                  text={element.get('text')}
                  fontSize={element.get('fontSize')}
                  color={element.get('color')}
                  isItalic={element.get('isItalic')}
                  isBold={element.get('isBold')}
                />
                {index === this.props.visibleQuestions.size - 1 &&
                  !this.props.isShowingSubmit &&
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={() => this.props.dispatch(nextQuestion())}
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
                    onClick={() => this.props.dispatch(nextQuestion())}
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
                      onClick={() => this.props.dispatch(nextQuestion())}
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
                onAnswer={this.handleQuestionAnswered}
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
                  {this.renderButton(
                    element.get('required'),
                    responseElement.get('answers').size
                  )}
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

function mapStateToProps(state, ownProps) {
  const showSubmit = isLastQuestion(state);
  const props = {
    response: getCurrentResponse(state),
    version: getCurrentVersion(state),
    visibleQuestions: getVisibleQuestions(state),
    answeredQuestions: getAnsweredQuestions(state),
    questions: getQuestions(state),
    isShowingSubmit: showSubmit,
    isShowingNext: !showSubmit,
    isShowingBack: isFirstQuestion(state),
    debug: getDebug(state)
  };
  return props;
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    submitQuestionnaire: () => {
      // set as submitted
      dispatch(setResponseSubmitted());
      // go to summary page, that also shows the end text
      hashHistory.push(
        `/users/${ownProps.params.userId}/questionnaires/${ownProps.params.questionnaireId}/summary`
      );
    },
    onMatrixAnswerClicked: (
      responseElementId,
      questionId,
      answerId,
      selected
    ) => {
      dispatch(
        setMatrixQuestionAnswer({
          responseElementId,
          questionId,
          answerId,
          selected
        })
      );
    },
    dispatch
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  QuestionnaireFormContainer
);
