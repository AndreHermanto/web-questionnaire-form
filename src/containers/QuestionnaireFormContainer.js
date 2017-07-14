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
import Form from '../components/Form';

class QuestionnaireFormContainer extends Component {
  constructor(props) {
    super(props);
    this.setPageMode = this.setPageMode.bind(this);
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

  render() {
    return <Form {...this.props} />;
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
    nextQuestion: () => dispatch(nextQuestion()),
    submitQuestionnaire: () => {
      // set as submitted
      dispatch(setResponseSubmitted());
      // go to summary page, that also shows the end text
      hashHistory.push(
        `/users/${ownProps.params.userId}/questionnaires/${ownProps.params.questionnaireId}/summary`
      );
    },
    onQuestionAnswered: responseElement => {
      dispatch(setQuestionAnswer({ responseElement }));
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
