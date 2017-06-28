import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchVersion } from '../actions';
import { hashHistory } from 'react-router';
import QuestionnaireStartPage from '../components/QuestionnaireStartPage';

class QuestionnaireStartPageContainer extends Component {
  componentWillMount() {
    if (this.props.params.questionnaireId && this.props.params.versionId) {
      this.props
        .dispatch(
          fetchVersion(
            this.props.params.questionnaireId,
            this.props.params.versionId
          )
        )
        .then(() => {
          this.props.items.map(questionnaire => {
            if (questionnaire.get('startPage') === undefined) {
              return hashHistory.push(
                `/users/admin/questionnaires/${questionnaire.get(
                  'questionnaireId'
                )}?resume=${this.props.location.query.resume}&showlogic=true`
              );
            }
            else {
              return '';
            }
          });
        });
    }
  }

  render() {
    return (
      <div>
        {this.props.items &&
          this.props.items.map(questionnaire => {
            return (
              <QuestionnaireStartPage
                questionnaire={questionnaire}
                resume={this.props.location.query.resume}
                showlogic={true}
              />
            );
          })}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    items: state.versions.items
  };
}

export default connect(mapStateToProps)(QuestionnaireStartPageContainer);
