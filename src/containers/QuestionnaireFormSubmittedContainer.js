import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  getCurrentVersion
} from '../reducers';
import QuestionnaireFormSubmitted from '../components/QuestionnaireFormSubmitted';

class QuestionnaireFormSubmittedContainer extends Component {
  render() {
    return <QuestionnaireFormSubmitted version={this.props.version} />;
  }
}

function mapStateToProps(state, ownProps) {
  const props = {
    version: getCurrentVersion(state)
  };
  return props;
}

export default connect(mapStateToProps)(QuestionnaireFormSubmittedContainer);
