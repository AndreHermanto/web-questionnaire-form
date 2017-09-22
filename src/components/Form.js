import React, { Component } from 'react';
import { Modal, ProgressBar, Grid, Col, Row, Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';
import ElementContainer from '../containers/ElementContainer';
import FailedToDecryptMessage from './FailedToDecryptMessage';
import fontSizeLogo from '../assets/images/fontsize_logo.png';
import '../loading.css';

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
    onSubmit: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired
  };
  render() {
    if (this.props.isLoading) {
      return <span className="loading" />;
    }
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
          This questionnaire has been submitted.
        </Grid>
      );
    }
    if (this.props.isError) {
      return (
        <Grid>
          <Alert bsStyle="danger">
            <h4>Unable to save</h4>
            <p>
              Apologies, the platform has encountered an error and your last response could not be submitted.
            </p>
            <p>
              All your previous responses have been recorded and you will be able to continue filling in the questionnaire from where you've left it.
            </p>
            <p>
              Please return to MyChart and try again later.
            </p>
          </Alert>
        </Grid>
      );
    }
    if (!this.props.responseElementIds) {
      return <span className="loading" />;
    }
    return (
      <div
        className="container"
        style={{
          paddingBottom: '75px',
          fontSize: `${100 + this.props.largeText * 75}%`
        }}
      >
        {window.location.href.indexOf('/preview') >= 0 &&
          <div className="alert alert-info">This is a preview</div>}
        <button
          className="btn btn-default"
          onClick={() =>
            this.props.cycleFontSize(
              this.props.largeText < 2 ? this.props.largeText + 1 : 0
            )}
        >
          <img alt="icon" src={fontSizeLogo} />
        </button>
        <div style={{ marginTop: '30px' }} id="section-to-print">
          {this.props.responseElementIds.map(id => (
            <ElementContainer key={id} responseElementId={id} />
          ))}
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
                style={{
                  backgroundColor: !this.props.showSubmit ? '#ccc' : '#337ab7',
                  borderColor: !this.props.showSubmit ? '#ccc' : '#2e6da4'
                }}
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
            <h5 style={{ marginTop: 24 }}>A. I’m not ready</h5>
            <button
              className="btn btn-primary btn-block btn-lg"
              style={{ textAlign: 'left' }}
              onClick={this.props.onCancelSubmit}
            >
              I want to review or change my answers
            </button>
            <h5 style={{ marginTop: 24 }}> B. I’m ready to go</h5>
            <button
              className="btn btn-default btn-block btn-lg"
              style={{ textAlign: 'left' }}
              onClick={() => window.print()}
            >
              Print My Answers
            </button>{' '}
            <button
              className="btn btn-success btn-block btn-lg"
              style={{ textAlign: 'left' }}
              onClick={this.props.onSubmit}
            >
              Submit My Answers
            </button>{' '}
            <p className="text-muted text-center" style={{ marginTop: 8 }}>
              After submission, you cannot review or change your answers
            </p>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default Form;
