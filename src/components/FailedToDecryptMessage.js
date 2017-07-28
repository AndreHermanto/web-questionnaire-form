import React from 'react';
import { Alert } from 'react-bootstrap';

const FailedToDecryptMessage = props => {
  return (
    <Alert bsStyle="danger">
      <h4>Unable to Verify User</h4>
      <p>
        We are unable to verify who you are. Please return to MyChart and try again.
      </p>
    </Alert>
  );
};
export default FailedToDecryptMessage;
