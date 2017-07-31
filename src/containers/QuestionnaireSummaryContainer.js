import React, { Component } from 'react';
// import QuestionnaireSummary from '../components/QuestionnaireSummary';
import { connect } from 'react-redux';
import * as selectors from '../reducers';
import * as actions from '../actions';
import toJS from '../components/toJS';

class QuestionnaireSummaryContainer extends Component {
  componentDidMount() {
    this.props
      .dispatch(actions.fetchResponse(this.props.params.responseId))
      .then(response => {
        this.props.dispatch(
          actions.fetchVersion(response.questionnaireId, response.versionId)
        );
      });
  }

  render() {
    return (
      <div className="container">
        {this.props.endPage &&
          <div style={{ whiteSpace: 'pre-wrap' }}>
            {this.props.endPage.text}
          </div>}
        {!this.props.endPage &&
          <div style={{ whiteSpace: 'pre-wrap' }}>
            Thank you for submitting.
          </div>}
        {this.props.endPage &&
          this.props.endPage.image &&
          <img
            src={this.props.endPage.image}
            alt="introduction"
            className="img-responsive"
          />}
        <a
          className="btn btn-primary btn-lg"
          href={`#/home/${encodeURIComponent(this.props.encryptedUserId)}/${encodeURIComponent(this.props.encryptedConsentTypeId)}`}
        >
          Return Home
        </a>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const endPage = selectors.getEndPageMessage(
    state,
    ownProps.params.responseId
  );
  return {
    endPage,
    encryptedUserId: ownProps.params.encryptedUserId,
    encryptedConsentTypeId: ownProps.params.encryptedConsentTypeId
  };
}

export default connect(mapStateToProps)(toJS(QuestionnaireSummaryContainer));
