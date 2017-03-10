import React, { Component } from 'react';
import {
  Router,
  Route,
  browserHistory
} from 'react-router';
import QuestionnaireAdmin from './../../questionnaires/QuestionnaireAdminContainer';
import QuestionnaireForm from './../../questionnaires/QuestionnaireFormContainer';

class Routes extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={QuestionnaireAdmin} />
        <Route path="/users/:userId/questionnaires/:questionnaireId" component={QuestionnaireForm} />
      </Router>
    );
  }
}

export default Routes;
