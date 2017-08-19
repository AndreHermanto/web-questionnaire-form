import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchDataForHomepage } from '../actions';
import { decryptTokens } from '../actions/security';
import toJS from '../components/toJS';
import QuestionnaireDashboard from '../components/QuestionnaireDashboard';
import Footer from '../components/Footer';
import * as selectors from '../reducers';

class PatientHomeContainer extends Component {
  componentDidMount() {
    const { userId, consentTypeId } = this.props.params;
    const { timestamp } = this.props.location.query;
    this.props
      .dispatch(decryptTokens(userId, consentTypeId, timestamp))
      .then(() => {
        this.props.dispatch(fetchDataForHomepage());
      })
      .catch(error => {
        console.log('Decryption Failed', error);
      });
  }
  render() {
    return (
      <div>
        <QuestionnaireDashboard {...this.props} />
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const questionnaires = selectors.getHomepageQuestionnaires(state);
  return {
    encryptedConsentTypeId: ownProps.params.consentTypeId,
    encryptedUserId: ownProps.params.userId,
    failedToDecrypt: selectors.getFailedToDecrypt(state),
    questionnaires
  };
}

export default connect(mapStateToProps)(toJS(PatientHomeContainer));
