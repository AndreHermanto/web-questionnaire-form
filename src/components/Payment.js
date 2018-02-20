import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getAccessToken } from '../cookies';
import get from 'lodash.get';
import { Segment } from 'semantic-ui-react';

class Payment extends Component {
  static propTypes = {
    pricePlanId: PropTypes.string.isRequired,
    consentTypeId: PropTypes.string.isRequired,
    isPaid: PropTypes.bool.isRequired
  };
  componentDidMount() {
    this.props.fetchPricePlan(this.props.pricePlanId);
  }

  handlePayment = (consentTypeId, pricePlanId) => () => {
    window.location.assign(
      `${process.env
        .REACT_APP_PAYMENTS_URL}/users/price-plans/${encodeURIComponent(
        pricePlanId
      )}?jwt=${getAccessToken()}&returnTo=${encodeURIComponent(
        window.location.href
      )}`
    );
  };

  unPaid = (consentTypeId, pricePlan) => {
    return (
      <div>
        <p>
          Thank you for completing the Sanford Chip Self-Assessment. Our records
          tell us that you still need to provide payment for the Sanford Chip.
          You can provide payment by clicking on the "Go to Pay" button located
          below.
        </p>

        <p>
          <strong>
            Amount Due ${get(pricePlan, 'amount', '')}{' '}
            {get(pricePlan, 'currency.currencyName', '')}
          </strong>
        </p>

        <a
          className="btn btn-primary btn-lg"
          href={`${process.env
            .REACT_APP_PAYMENTS_URL}/users/price-plans/${encodeURIComponent(
            pricePlan.id
          )}?jwt=${getAccessToken()}&returnTo=${encodeURIComponent(
            window.location.href
          )}`}
        >
          Go to Pay
        </a>
      </div>
    );
  };

  render() {
    const { pricePlanId, consentTypeId, isPaid, pricePlans } = this.props;
    if (
      !Array.isArray(pricePlans) ||
      pricePlans.length === 0 ||
      pricePlans[0].id !== pricePlanId
    ) {
      return null;
    }

    return (
      <div>
        {!isPaid && (
          <Segment padded style={{ marginBottom: 24 }}>
            {this.unPaid(consentTypeId, pricePlans[0])}
          </Segment>
        )}
      </div>
    );
  }
}

export default Payment;
