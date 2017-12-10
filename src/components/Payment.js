import React, { Component } from 'react';
import { Button, Table } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { getAccessToken } from '../cookies';
import get from 'lodash.get';

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
      `${process.env.REACT_APP_PAYMENTS_URL}/users/price-plans/${encodeURIComponent(pricePlanId)}?jwt=${getAccessToken()}&returnTo=${encodeURIComponent(window.location.href)}`
    );
  };

  paid = () => {
    return (
      <div>
        <h2 style={{ fontSize: 16, padding: '24px 0 24px 0', color: '#666' }}>
          Payment
        </h2>
        <div> Congratulations! Your payment has been completed </div>
      </div>
    );
  };

  unPaid = (consentTypeId, pricePlan) => {
    return (
      <div>
        <h2 style={{ fontSize: 16, padding: '24px 0 24px 0', color: '#666' }}>
          Payment
        </h2>

        <Table striped bordered condensed hover>
          <tbody>
            <tr>
              <td>Title</td>
              <td>{get(pricePlan, 'title', '')}</td>
            </tr>
            <tr>
              <td>Description</td>
              <td>{get(pricePlan, 'description', '')}</td>
            </tr>
            <tr>
              <td>Currency</td>
              <td>{get(pricePlan, 'currency.currencyName', '')}</td>
            </tr>
          </tbody>
        </Table>

        <Button
          className="btn btn-primary btn-lg"
          onClick={this.handlePayment(consentTypeId, pricePlan.id)}
        >
          Proceed to payment
        </Button>
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
        {isPaid ? this.paid() : this.unPaid(consentTypeId, pricePlans[0])}
      </div>
    );
  }
}

export default Payment;
