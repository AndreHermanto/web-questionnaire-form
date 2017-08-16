import React, { Component } from 'react';
import toJS from '../components/toJS';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
// import { scroller } from 'react-scroll';
import * as actions from '../actions';
import * as selectors from '../reducers';
import * as UIselectors from '../reducers/ui';
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
    const { userId, consentTypeId, questionnaireId } = this.props.params;
    const { timestamp } = this.props.location.query;
    this.props.initLargeText();
    this.props
      .dispatch(actions.decryptTokens(userId, consentTypeId, timestamp))
      .then(() => {
        this.props.dispatch(
          actions.setupQuestionnaire({
            questionnaireId
          })
        );
      });
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
  const progress = selectors.getProgress(state);
  let alreadySubmitted = false;
  const responseId = selectors.getResponseId(state);
  if (responseId) {
    alreadySubmitted = selectors
      .getResponseById(state, responseId)
      .get('completed');
  }

  return {
    failedToDecrypt: selectors.getFailedToDecrypt(state),
    responseElementIds: selectors.getVisibleResponseElementIds(state),
    showModal: selectors.getIsShowingSubmitModal(state),
    largeText: UIselectors.getLargeText(state.get('ui')),
    progress,
    showSubmit: progress === 100,
    alreadySubmitted
  };
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onShowSubmissionConfirmation: () =>
      dispatch(actions.showSubmissionConfirmation()),
    onCancelSubmit: () => dispatch(actions.hideSubmissionConfirmation()),
    onSubmit: () =>
      dispatch(
        actions.submitResponse(
          ownProps.params.userId,
          ownProps.params.consentTypeId
        )
      ),
    initLargeText: () => dispatch(actions.initLargeText()),
    setLargeText: () => dispatch(actions.setLargeText()),

    dispatch
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  toJS(QuestionnaireFormContainer)
);
