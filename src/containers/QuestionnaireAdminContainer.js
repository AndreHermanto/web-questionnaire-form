import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchQuestionnaires } from '../actions';
import {
  getAllQuestionnaires,
  fetchQuestionnairesIsLoading
} from '../reducers';
import QuestionnaireAdmin from '../components/QuestionnaireAdmin';
import toJS from '../components/toJS';

class QuestionnaireAdminContainer extends Component {
  componentDidMount() {
    return this.props.dispatch(fetchQuestionnaires());
  }
  render() {
    return <QuestionnaireAdmin {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {
    questionnaires: getAllQuestionnaires(state),
    isLoading: fetchQuestionnairesIsLoading(state)
  };
}

export default connect(mapStateToProps)(toJS(QuestionnaireAdminContainer));
