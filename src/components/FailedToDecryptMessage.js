import React from 'react';
import { Alert } from 'react-bootstrap';

const FailedToDecryptMessage = props => {
  return (
    <Alert bsStyle="danger">
      <h4>Unable to Verify User</h4>
      <p>
        The time window allocated to accessing this URL has expired. Please
        return to MyChart and try again.
      </p>
    </Alert>
  );
};
export default FailedToDecryptMessage;
