import React, {
  Component
} from 'react';
import { connect } from 'react-redux';
import {
  hashHistory
} from 'react-router';
import { fromJS } from 'immutable';
import { scroller } from 'react-scroll';
import {
  setResponse,
  setupQuestionnaire,
  nextQuestion,
  setQuestionnaireDebug,
  setQuestionAnswer
} from '../actions';
import Question from '../components/Question';
import TextInformation from '../components/TextInformation';
import {
  getVisibleQuestions,
  isLastQuestion,
  isFirstQuestion,
  getCurrentResponse,
  getCurrentVersion
} from '../reducers';
import Heading from '../components/Heading';

class QuestionnaireFormContainer extends Component {

  constructor(props) {
    super(props);
    this.handleQuestionAnswered = this.handleQuestionAnswered.bind(this);
    this.handeSubmitQuestionnaire = this.handeSubmitQuestionnaire.bind(this);
    this.setPageMode = this.setPageMode.bind(this);
  }

  setPageMode() {
    if(this.props.location.query.showlogic === 'true') {
      this.props.dispatch(setQuestionnaireDebug(true));
    }
    else {
      this.props.dispatch(setQuestionnaireDebug(false));
    }
  }

  componentWillMount() {
    this.setPageMode();
  }

  componentDidMount() {
    const { questionnaireId, userId } = this.props.params;
    const resume = this.props.location.query.resume === 'true';
    this.props.dispatch(setupQuestionnaire({
      questionnaireId,
      userId,
      resume
    }));
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.visibleQuestions.size !== this.props.visibleQuestions.size) {
      scroller.scrollTo(this.props.visibleQuestions.last().responseElement.get('id'), {
        duration: 500,
        delay: 0,
        smooth: true,
      });
    }
  }

  handleQuestionAnswered(responseElement) {
    this.props.dispatch(setQuestionAnswer({ responseElement }));
  }

  handeSubmitQuestionnaire() {
    const response = this.props.response.set('completed', true);
    this.props.dispatch(setResponse(response));
    hashHistory.push('/submitted');
  }

  render() {
    if (!this.props.version || !this.props.response) {
      return <div className="container">Loading...</div>;
    }
    return (<div className="container">
      {this.props.visibleQuestions.map((visibleQuestion, index) => {
        const { element, responseElement } = visibleQuestion;
        if (!element || !responseElement) {
          return <div>Loading question and reponse...</div>;
        }
        if (element.get('type') === 'textinformation') {
          return (<div key={responseElement.get('id')}>
            <TextInformation
              name={responseElement.get('id')}
              text={element.get('text')}
            />
            {index === this.props.visibleQuestions.size - 1 && !this.props.isShowingSubmit &&
            <button
              className="btn btn-primary btn-lg"
              onClick={() => this.props.dispatch(nextQuestion())}
            >
              {responseElement.get('answers').size ? 'Next' : 'Skip'}
            </button>
            }
          </div>);
        }

        // section heading
        if (element.get('type') === 'section') {
          return <div key={responseElement.get('id')} >
            <Heading
              text={element.get('title')}
              size={element.get('size')}
              name={responseElement.get('id')}
            />
            {index === this.props.visibleQuestions.size - 1 && !this.props.isShowingSubmit &&
            <button
              className="btn btn-primary btn-lg"
              onClick={() => this.props.dispatch(nextQuestion())}
            >
              Okay
            </button>
            }
          </div>
        }

        return (<div key={responseElement.get('id')}>
          <Question
            name={responseElement.get('id')}
            key={visibleQuestion.responseElement.get('id')}
            element={element}
            number={index + 1}
            responseElement={responseElement}
            onAnswer={this.handleQuestionAnswered}
            showlogic={this.props.debug}
          />
          {index === this.props.visibleQuestions.size - 1 && !this.props.isShowingSubmit &&
          <button
            className="btn btn-primary btn-lg"
            onClick={() => this.props.dispatch(nextQuestion())}
          >
            {responseElement.get('answers').size ? 'Next' : 'Skip'}
          </button>
          }
        </div>
        );
      })}
        {this.props.isShowingSubmit &&
          <button className="btn btn-primary btn-lg"
            onClick={this.handeSubmitQuestionnaire}>
            Submit
          </button>
        }
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
    isShowingSubmit: showSubmit,
    isShowingNext: !showSubmit,
    isShowingBack: isFirstQuestion(state),
    debug: state.debug.debug
  };
  return props;
}

export default connect(mapStateToProps)(QuestionnaireFormContainer);
