import React, { Component } from 'react';
import { Modal, ProgressBar, Grid, Col, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import ElementContainer from '../containers/ElementContainer';
import FailedToDecryptMessage from './FailedToDecryptMessage';

class Form extends Component {
  static propTypes: {
    failedToDecrypt: PropTypes.bool.isRequired,
    responseElementIds: PropTypes.array.isRequired,
    showModal: PropTypes.bool.isRequired,
    progress: PropTypes.number.isRequired,
    showSubmit: PropTypes.bool.isRequired,
    alreadySubmitted: PropTypes.bool.isRequired,

    onShowSubmissionConfirmation: PropTypes.func.isRequired,
    onCancelSubmit: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  };
  render() {
    if (this.props.failedToDecrypt) {
      return (
        <Grid>
          <FailedToDecryptMessage />
        </Grid>
      );
    }
    if (this.props.alreadySubmitted) {
      return (
        <Grid>
          You have already submitted a response to this questionnaire.
        </Grid>
      );
    }
    if (!this.props.responseElementIds) {
      return <div className="container">Loading...</div>;
    }
    return (
      <div className="container" style={{ paddingBottom: '75px' }}>
        {this.props.responseElementIds.map(id => (
          <ElementContainer key={id} responseElementId={id} />
        ))}
        <div className="text-muted">
          Built at: {process.env.REACT_APP_BUILD_TIME}
        </div>

        <div
          style={{
            position: 'fixed',
            backgroundColor: 'white',
            bottom: 0,
            left: 0,
            right: 0,
            padding: 8,
            borderTop: '1px solid #eee'
          }}
        >
          <Row>
            <Col sm="10">
              <ProgressBar
                style={{ marginTop: 15 }}
                now={this.props.progress}
                label={parseInt(this.props.progress, 10) + '%'}
              />
            </Col>
            <Col sm="2">
              <button
                onClick={this.props.onShowSubmissionConfirmation}
                className="btn btn-lg btn-primary btn-block"
                disabled={!this.props.showSubmit}
              >
                Submit
              </button>
            </Col>
          </Row>
        </div>

        <Modal show={this.props.showModal} onHide={this.props.onCancelSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Submit Questionnaire</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Are you sure you are ready to submit?</h4>
            <p>Please review your answers at this time before submitting.</p>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-primary" onClick={this.props.onSubmit}>
              Submit
            </button>
            <button
              className="btn btn-default"
              onClick={this.props.onCancelSubmit}
            >
              Review Answers
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default Form;
