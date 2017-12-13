import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as selectors from '../reducers';
import * as actions from '../actions';
import toJS from '../components/toJS';
import Markdown from 'react-markdown';

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
        {this.props.endPage && (
          <div style={{ whiteSpace: 'pre-wrap' }}>
            <Markdown
              source={this.props.endPage.text}
              escapeHtml={true}
              skipHtml={true}
            />
          </div>
        )}
        {!this.props.endPage && (
          <div style={{ whiteSpace: 'pre-wrap' }}>
            Thank you for submitting.
          </div>
        )}
        {this.props.endPage &&
          this.props.endPage.image && (
            <img
              src={this.props.endPage.image}
              alt="introduction"
              className="img-responsive"
            />
          )}
        <a
          className="btn btn-primary btn-lg"
          href={`#/home/${encodeURIComponent(
            this.props.encryptedUserId
          )}/${encodeURIComponent(this.props.encryptedConsentTypeId)}`}
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
    ownProps.match.params.responseId
  );
  return {
    endPage,
    encryptedUserId: ownProps.match.params.encryptedUserId,
    encryptedConsentTypeId: ownProps.match.params.encryptedConsentTypeId
  };
}

export default connect(mapStateToProps)(toJS(QuestionnaireSummaryContainer));
