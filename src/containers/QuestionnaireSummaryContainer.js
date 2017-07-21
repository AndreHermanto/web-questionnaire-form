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
          <div>
            {this.props.endPage.text}
          </div>}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const endPage = selectors.getEndPageMessage(
    state,
    ownProps.params.responseId
  );
  console.log('got end page', endPage);
  return {
    endPage
  };
}

export default connect(mapStateToProps)(toJS(QuestionnaireSummaryContainer));
