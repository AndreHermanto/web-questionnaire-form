import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  fetchDataForHomepage,
  fetchPricePlan,
  fetchPricePlansMapping,
  fetchPayments
} from '../actions';
import { decryptTokens } from '../actions/security';
import toJS from '../components/toJS';
import QuestionnaireDashboard from '../components/QuestionnaireDashboard';
import * as selectors from '../reducers';
import { getAllPayments } from '../reducers/payments';
import { getAllPricePlansMapping } from '../reducers/pricePlansMapping';
import * as actions from '../actions';
import QueryString from 'query-string';

class PatientHomeContainer extends Component {
  componentDidMount() {
    const { userId, consentTypeId } = this.props.match.params;
    const parsed = QueryString.parse(this.props.location.search);
    const { timestamp } = parsed;

    this.props
      .dispatch(decryptTokens(userId, consentTypeId, timestamp))
      .then(() => {
        //if we got a jwt
        this.props.dispatch(fetchDataForHomepage());
        // fetch payments
        this.props.dispatch(fetchPayments());

        // fetch price plan mapping
        this.props.dispatch(fetchPricePlansMapping());

        // fetch LandingPage
        this.props.dispatch(actions.fetchLandingPage());
      })
      .catch(error => {
        console.log('Decryption Failed', error);
      });
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

const getPricePlanId = state => {
  const consentTypeId = state.getIn(['ui', 'consentTypeId']);

  const pricePlanId = getAllPricePlansMapping(
    state.getIn(['entities', 'pricePlansMapping'])
  ).reduce(
    (res, item, index) =>
      item.get('consentTypeId') === consentTypeId
        ? item.get('pricePlanId')
        : res,
    ''
  );

  return pricePlanId;
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
    encryptedConsentTypeId: ownProps.match.params.consentTypeId,
    encryptedUserId: ownProps.match.params.userId,
    failedToDecrypt: selectors.getFailedToDecrypt(state),
    questionnaires,
    pricePlanId: getPricePlanId(state, ownProps),
    isPaid: getAllPayments(state.getIn(['entities', 'payments'])).size > 0,
    landingPage: selectors.getLandingPage(state),
    isLoadingReponses: selectors.isLoadingReponses(state),
    pricePlans: selectors.getAllPricePlans(state)
  };
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchPricePlan: pricePlanId => {
      dispatch(fetchPricePlan(pricePlanId));
    },
    dispatch
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  toJS(PatientHomeContainer)
);
