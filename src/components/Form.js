import React, { Component } from 'react';
import { Modal, ProgressBar, Grid, Col, Row, Glyphicon } from 'react-bootstrap';
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
    responseElementsWithInvalidAnswers: PropTypes.object.isRequired,

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
      <div
        className="container"
        style={{
          paddingBottom: '75px',
          fontSize: this.props.largeText ? '175%' : '100%'
        }}
      >
        <button
          className="btn btn-xs btn-default pull-right"
          onClick={this.props.setLargeText}
        >
          {this.props.largeText ? 'Small Text' : 'Large Text'}
        </button>
        <div style={{ marginTop: '30px' }} id="section-to-print">
          {this.props.responseElementIds.map(id =>
            <ElementContainer key={id} responseElementId={id} />
          )}
        </div>
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
          id="progress-bar-container"
        >
          <Row>
            <Col sm={10}>
              <ProgressBar
                style={{ marginTop: 15 }}
                now={this.props.progress}
                label={parseInt(this.props.progress, 10) + '%'}
              />
            </Col>
            <Col sm={2}>
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

        <Modal
          show={this.props.showModal}
          onHide={this.props.onCancelSubmit}
          id="submit-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>Submit Questionnaire</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Are you sure you are ready to submit?</h4>
            <p>Please review your answers at this time before submitting.</p>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-warning" onClick={() => window.print()}>
              <Glyphicon glyph="print" /> Print
            </button>{' '}
            <button className="btn btn-primary" onClick={this.props.onSubmit}>
              Submit
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default Form;
