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

  paid = () => {
    return (
      <div>
        <div>
          <p>
            You are now enrolled in the Sanford Chip. A message will be sent to
            your doctor letting them know that you have completed the enrollment
            process.
          </p>
          <h3>Genetic Testing Process</h3>
          <ul>
            <li>
              Please wait 2 business days before going to any Sanford Lab to
              have your blood drawn.
            </li>
            <li>
              After your blood sample is drawn, it will be sent to a Sanford lab
              for genetic testing.
            </li>
            <li>
              When the genetic testing is done, the results will be sent to your
              doctor.
            </li>
          </ul>

          <h3>From this page you may either:</h3>
          <ul>
            <li> Close the browser</li>
            <li>Complete any other surveys you may have at this time.</li>
          </ul>

          <p style={{ fontSize: 24, color: '#62A5DB' }}>
            <strong>
              Thank-you for partnering with our team! You are a valued member of
              our Sanford Health Family!
            </strong>
          </p>
        </div>
      </div>
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
      <Segment padded style={{ marginBottom: 24 }}>
        {isPaid ? this.paid() : this.unPaid(consentTypeId, pricePlans[0])}
      </Segment>
    );
  }
}

export default Payment;
