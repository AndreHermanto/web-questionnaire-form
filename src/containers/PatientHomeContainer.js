import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchDataForHomepage } from '../actions';
import { decryptTokens } from '../actions/security';

import QuestionnaireDashboard from '../components/QuestionnaireDashboard';
import Footer from '../components/Footer';
import { getHomepageQuestionnaires } from '../reducers';

class PatientHomeContainer extends Component {
  componentDidMount() {
    const { encryptedUserId, encryptedConsentTypeId } = this.props.params;
    const { timestamp } = this.props.location.query;
    this.props
      .dispatch(
        decryptTokens(encryptedUserId, encryptedConsentTypeId, timestamp)
      )
      .then(() => {
        this.props.dispatch(fetchDataForHomepage());
      });
  }
  render() {
    const { questionnaires } = this.props;
    const { userId } = this.props.params;
    return (
      <div>
        <QuestionnaireDashboard
          failedToDecrypt={this.props.failedToDecrypt}
          items={questionnaires}
          userId={userId}
        />
        <Footer />
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const questionnaires = getHomepageQuestionnaires(state);
  return {
    failedToDecrypt: state.get('ui').get('failedToDecrypt'),
    questionnaires
  };
}

export default connect(mapStateToProps)(PatientHomeContainer);
