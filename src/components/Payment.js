import React from 'react';
import { Button, Table } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { getAccessToken } from '../cookies';

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
      <div> Congratulations! Your payment has been completed </div>
    </div>
  );
}

function unPaid(payment, consentTypeId) {
  return (
    <div>
      <Table striped bordered condensed hover>
        <tbody>
          <tr>
            <td>Title</td>
            <td>{payment.title}</td>
          </tr>
          <tr>
            <td>Description</td>
            <td>{payment.description}</td>
          </tr>
          <tr>
            <td>Coupons</td>
            <td>{payment.coupons.title}</td>
          </tr>
          <tr>
            <td>Currency</td>
            <td>{payment.currency.currencyName}</td>
          </tr>
        </tbody>
      </Table>

      <Button
        className="btn btn-primary btn-lg"
        onClick={handlePayment(consentTypeId, payment.id)}
      >
        Go to pay
      </Button>
    </div>
  );
}

function Payment(props) {
  const { payment, consentTypeId, isPaid } = props;

  if (!payment) return <div />;

  return (
    <div>
      <h2 style={{ fontSize: 16, padding: '24px 0 24px 0', color: '#666' }}>
        Payment
      </h2>
      {isPaid ? Paid() : unPaid(payment, consentTypeId)}
    </div>
  );
}

Payment.propTypes = propTypes;

export default Payment;
