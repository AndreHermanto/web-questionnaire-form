import React from 'react';
import { Button, Table } from 'react-bootstrap';

const handlePayment = (consentTypeId, pricePlanId) => () => {
  window.location.assign(
    `${process.env
      .REACT_APP_PATIENT_PORTAL_URL}/payments/consent-type/${encodeURIComponent(
      consentTypeId
    )}/price-plan/${encodeURIComponent(pricePlanId)}/`
  );
};

function Payment(props) {
  const { payment, consentTypeId } = props;

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

export default Payment;
