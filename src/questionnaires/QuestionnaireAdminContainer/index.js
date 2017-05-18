import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchQuestionnaires } from '../../actions';
import QuestionnaireAdmin from '../components/QuestionnaireAdmin'

class QuestionnaireAdminContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionnaires: []
    };
  }

  componentWillMount() {
    return this.props.dispatch(fetchQuestionnaires());
  }

  render() {
    return <QuestionnaireAdmin questionnaires={this.props.questionnaires} />
  }
}

function mapStateToProps(state) {
  return {
    questionnaires: state.questionnaires
  };
}

export default connect(mapStateToProps)(QuestionnaireAdminContainer);
