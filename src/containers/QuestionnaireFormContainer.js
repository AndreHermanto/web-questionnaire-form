import React, { Component } from 'react';
import toJS from '../components/toJS';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import { scroller } from 'react-scroll';
import * as actions from '../actions';
import * as selectors from '../reducers';
import Form from '../components/Form';

const propTypes = {
  routeParams: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    questionnaireId: PropTypes.string.isRequired
  })
};
class QuestionnaireFormContainer extends Component {
  static propTypes: propTypes;

  // constructor(props) {
  //   super(props);
  //   this.setPageMode = this.setPageMode.bind(this);
  // }
  //
  // setPageMode() {
  //   if (this.props.location.query.showlogic === 'true') {
  //     this.props.dispatch(setQuestionnaireDebug(true));
  //   } else {
  //     this.props.dispatch(setQuestionnaireDebug(false));
  //   }
  // }
  //
  // componentWillMount() {
  //   this.setPageMode();
  // }

  componentDidMount() {
    const { questionnaireId, userId } = this.props.params;
    this.props.dispatch(
      actions.setupQuestionnaire({
        questionnaireId,
        userId
      })
    );
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if (prevProps.visibleQuestions.size !== this.props.visibleQuestions.size) {
  //     scroller.scrollTo(
  //       this.props.visibleQuestions.last().responseElement.get('id'),
  //       {
  //         duration: 500,
  //         delay: 0,
  //         smooth: true
  //       }
  //     );
  //   }
  // }

  render() {
    return <Form {...this.props} />;
  }
}

function mapStateToProps(state, ownProps) {
  // const showSubmit = isLastQuestion(state);
  const progress = selectors.getProgress(state);
  const props = {
    responseElementIds: selectors.getVisibleResponseElementIds(state),
    showModal: selectors.getIsShowingSubmitModal(state),
    progress,
    showSubmit: progress === 100
  };
  return props;
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    // nextQuestion: () => dispatch(nextQuestion()),
    onShowSubmissionConfirmation: () =>
      dispatch(actions.showSubmissionConfirmation()),
    onCancelSubmit: () => dispatch(actions.hideSubmissionConfirmation()),
    onSubmit: () => {
      dispatch(actions.submitResponse());
    },
    // onQuestionAnswered: responseElement => {
    //   dispatch(setQuestionAnswer({ responseElement }));
    // },
    // onMatrixAnswerClicked: (
    //   responseElementId,
    //   questionId,
    //   answerId,
    //   selected
    // ) => {
    //   dispatch(
    //     setMatrixQuestionAnswer({
    //       responseElementId,
    //       questionId,
    //       answerId,
    //       selected
    //     })
    //   );
    // },
    dispatch
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  toJS(QuestionnaireFormContainer)
);
