import React, {
  Component
} from 'react';
import Summary from '../components/Summary';
import QuestionnaireSummary from '../components/QuestionnaireSummary';
import { connect } from 'react-redux';
import {
  hashHistory
} from 'react-router';
import {
  setupQuestionnaire,
  setResponseSubmitted
} from '../actions';
import {
  getCurrentResponse,
  getVisibleQuestions
} from '../reducers';

class QuestionnaireSummaryContainer extends Component {

  constructor(props) {
    super(props);
    this.handleSubmitQuestionnaire = this.handleSubmitQuestionnaire.bind(this);
    this.handleBack = this.handleBack.bind(this);
  }

  componentDidMount () {
    window.scrollTo(0, 0)
    const { questionnaireId, userId } = this.props.params;
    const resume = true;
    this.props.dispatch(setupQuestionnaire({
      questionnaireId,
      userId,
      resume
    }));
  }

  handleSubmitQuestionnaire() {
    this.props.dispatch(setResponseSubmitted());
    hashHistory.push('/submitted');
  }

  handleBack() {
    hashHistory.push(`/users/admin/questionnaires/${this.props.params.questionnaireId}?resume=true&showlogic=true`);
  }

  render() {

    return (
      <QuestionnaireSummary
        isCompleted={this.props.responses.get('completed')}
        questions={this.props.questions}
        onSubmit={this.handleSubmitQuestionnaire}
        onEdit={this.handleBack}
      />
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    responses: getCurrentResponse(state),
    questions: getVisibleQuestions(state)
  }
}

export default connect(mapStateToProps)(QuestionnaireSummaryContainer);
