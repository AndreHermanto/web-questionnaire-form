import React, { Component } from 'react';
import QuestionnaireSummary from '../components/QuestionnaireSummary';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import { setupQuestionnaire } from '../actions';
import {
  getCurrentResponse,
  getVisibleQuestions,
  getEndPage
} from '../reducers';

class QuestionnaireSummaryContainer extends Component {
  constructor(props) {
    super(props);
    this.handleBack = this.handleBack.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    const { questionnaireId, userId } = this.props.params;
    const resume = true;
    this.props.dispatch(
      setupQuestionnaire({
        questionnaireId,
        userId,
        resume
      })
    );
  }

  handleBack() {
    hashHistory.push(
      `/users/admin/questionnaires/${this.props.params.questionnaireId}?resume=true&showlogic=true`
    );
  }

  render() {
    const { response, questions, endPage } = this.props;
    if (!response) {
      return <div>Loading response...</div>;
    }
    return (
      <QuestionnaireSummary
        isCompleted={response.get('completed')}
        questions={questions}
        onEdit={this.handleBack}
        endPage={endPage}
      />
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    response: getCurrentResponse(state),
    questions: getVisibleQuestions(state),
    endPage: getEndPage(state)
  };
}

export default connect(mapStateToProps)(QuestionnaireSummaryContainer);
