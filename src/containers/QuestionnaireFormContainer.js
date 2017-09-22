import React, { Component } from 'react';
import toJS from '../components/toJS';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as actions from '../actions';
import * as selectors from '../reducers';
import * as UIselectors from '../reducers/ui';
import Form from '../components/Form';
import { notify } from 'react-notify-toast';

const TOAST_DURATION = 2000;

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
  constructor() {
    super();
    this.show = notify.createShowQueue();
  }
  componentDidMount() {
    const { userId, consentTypeId, questionnaireId } = this.props.params;
    const { timestamp } = this.props.location.query;
    this.props
      .dispatch(actions.decryptTokens(userId, consentTypeId, timestamp))
      .then(() => {
        this.props.dispatch(
          actions.setupQuestionnaire({
            questionnaireId,
            consentTypeId
          })
        );
      })
      .catch(error => {
        console.log('Decryption failed', error);
      });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isResponseUpdating && !nextProps.isResponseUpdating) {
      if (nextProps.isError) {
        this.show('An error occured.', 'error', TOAST_DURATION);
      } else {
        this.show('Saved successfully.', 'success', TOAST_DURATION);
      }
    }
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
    isError: selectors.getIsResponseError(state),
    isResponseUpdating: selectors.getIsResponseUpdating(state),
    submitResponseFailure: selectors.getSubmitResponseFailure(state),
    failedToDecrypt: selectors.getFailedToDecrypt(state),
    responseElementIds: selectors.getVisibleResponseElementIds(state),
    showModal: selectors.getIsShowingSubmitModal(state),
    largeText: UIselectors.getLargeText(state.get('ui')),
    progress,
    showSubmit: progress === 100,
    alreadySubmitted,
    isLoading: selectors.getIsResponseLoading(state)
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
    cycleFontSize: fontSize => dispatch(actions.cycleFontSize(fontSize)),

    dispatch
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  toJS(QuestionnaireFormContainer)
);
