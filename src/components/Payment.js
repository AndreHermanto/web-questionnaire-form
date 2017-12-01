import React from 'react';
import { Button, Table } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { getAccessToken } from '../cookies';
import get from 'lodash.get';

const propTypes = {
  payment: PropTypes.object,
  consentTypeId: PropTypes.string.isRequired,
  isPaid: PropTypes.bool.isRequired
};

const handlePayment = (consentTypeId, pricePlanId) => () => {
  window.location.assign(
    `${process.env
      .REACT_APP_PAYMENTS_URL}/users/price-plans/${encodeURIComponent(
      pricePlanId
    )}?jwt=${getAccessToken()}`
  );
};

function Paid() {
  return (
    <div>
      <h2 style={{ fontSize: 16, padding: '24px 0 24px 0', color: '#666' }}>
        Payment
      </h2>
      <div> Congratulations! Your payment has been completed </div>
    </div>
  );
}

function unPaid(payment, consentTypeId) {
  if (!payment) return <div />;

  return (
    <div>
      <h2 style={{ fontSize: 16, padding: '24px 0 24px 0', color: '#666' }}>
        Payment
      </h2>
      <Table striped bordered condensed hover>
        <tbody>
          <tr>
            <td>Title</td>
            <td>{get(payment, 'title', '')}</td>
          </tr>
          <tr>
            <td>Description</td>
            <td>{get(payment, 'description', '')}</td>
          </tr>
          <tr>
            <td>Coupons</td>
            <td>{get(payment, 'coupons.title', '')}</td>
          </tr>
          <tr>
            <td>Currency</td>
            <td>{get(payment, 'currency.currencyName', '')}</td>
          </tr>
        </tbody>
      </Table>

      <Button
        className="btn btn-primary btn-lg"
        onClick={handlePayment(consentTypeId, payment.id)}
      >
        Proceed to payment
      </Button>
    </div>
  );
}

function Payment(props) {
  const { payment, consentTypeId, isPaid } = props;

  return <div>{isPaid ? Paid() : unPaid(payment, consentTypeId)}</div>;
}

Payment.propTypes = propTypes;

export default Payment;
