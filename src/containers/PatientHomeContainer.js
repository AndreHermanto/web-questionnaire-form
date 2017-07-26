import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchDataForHomepage } from '../actions';

import QuestionnaireDashboard from '../components/QuestionnaireDashboard';
import Footer from '../components/Footer';
import { getHomepageQuestionnaires } from '../reducers';

class PatientHomeContainer extends Component {
  componentDidMount() {
    const { userId, consentTypeId } = this.props.params;
    this.props.dispatch(fetchDataForHomepage(consentTypeId, userId));
  }
  render() {
    const { questionnaires } = this.props;
    const { userId } = this.props.params;
    return (
      <div>
        <QuestionnaireDashboard items={questionnaires} userId={userId} />
        <Footer />
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { userId, consentTypeId } = ownProps.params;
  const questionnaires = getHomepageQuestionnaires(
    state,
    consentTypeId,
    userId
  );
  return {
    questionnaires
  };
}

export default connect(mapStateToProps)(PatientHomeContainer);
