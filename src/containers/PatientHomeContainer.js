import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchQuestionnaires, setResume } from '../actions';
import QuestionnaireDashboard from '../components/QuestionnaireDashboard';
import Footer from '../components/Footer';

class PatientHomeContainer extends Component {
  constructor(props) {
    super(props);
    this.handleChangeResume = this.handleChangeResume.bind(this);
  }
  componentDidMount() {
    return this.props.dispatch(fetchQuestionnaires());
  }
  handleChangeResume() {
    this.props.dispatch(setResume(!this.props.resume));
  }
  render() {
    return (
      <div>
        <QuestionnaireDashboard />
        <Footer />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return state.questionnaires;
}

export default connect(mapStateToProps)(PatientHomeContainer);
