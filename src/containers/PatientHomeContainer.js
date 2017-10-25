import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchDataForHomepage } from '../actions';
import { decryptTokens } from '../actions/security';
import toJS from '../components/toJS';
import QuestionnaireDashboard from '../components/QuestionnaireDashboard';
import * as selectors from '../reducers';
import * as actions from '../actions';

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
    this.props.dispatch(actions.fetchLandingPage(consentTypeId));
  }
  render() {
    return (
      <div style={{ height: 'inherit' }}>
        <QuestionnaireDashboard {...this.props} />
      </div>
    );
  }
}

const calculateTimeInMinutes = size => {
  if (size <= 1) {
    return 1.25;
  }
  if (size <= 2) {
    return size * 0.67;
  }
  if (size <= 10) {
    return size * 0.5;
  }
  if (size <= 15) {
    return size * 0.41;
  }
  if (size <= 25) {
    return size * 0.35;
  }
  return size * 0.16;
};
function mapStateToProps(state, ownProps) {
  const questionnaires = selectors
    .getHomepageQuestionnaires(state)
    .map(
      version =>
        version
          ? version.set(
              'time',
              calculateTimeInMinutes(version.get('body').size)
            )
          : version
    );
  return {
    encryptedConsentTypeId: ownProps.params.consentTypeId,
    encryptedUserId: ownProps.params.userId,
    failedToDecrypt: selectors.getFailedToDecrypt(state),
    questionnaires,
    landingPage: selectors.getLandingPage(state)
  };
}

export default connect(mapStateToProps)(toJS(PatientHomeContainer));
