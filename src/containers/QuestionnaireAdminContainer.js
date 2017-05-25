import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchQuestionnaires } from '../actions';
import QuestionnaireAdmin from '../components/QuestionnaireAdmin';

class QuestionnaireAdminContainer extends Component {
  componentWillMount() {
    return this.props.dispatch(fetchQuestionnaires());
  }

  render() {
    return <QuestionnaireAdmin {...this.props} />;
  }
}

function mapStateToProps(state) {
  return state.questionnaires;
}

export default connect(mapStateToProps)(QuestionnaireAdminContainer);
