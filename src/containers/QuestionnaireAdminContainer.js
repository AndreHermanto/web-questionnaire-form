import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchQuestionnaires, setResume } from '../actions';
import QuestionnaireAdmin from '../components/QuestionnaireAdmin';

class QuestionnaireAdminContainer extends Component {
  constructor(props) {
    super(props);
    this.handleChangeResume = this.handleChangeResume.bind(this);
  }
  componentWillMount() {
    return this.props.dispatch(fetchQuestionnaires());
  }
  handleChangeResume() {
    this.props.dispatch(setResume(!this.props.resume));
  }
  render() {
    return <QuestionnaireAdmin {...this.props} handleChangeResume={this.handleChangeResume} />;
  }
}

function mapStateToProps(state) {
  return state.questionnaires;
}

export default connect(mapStateToProps)(QuestionnaireAdminContainer);
