import React, { Component } from 'react';
import { 
  Router, 
  Route, 
  hashHistory 
} from 'react-router';
import QuestionnaireAdmin from './../../questionnaires/QuestionnaireAdminContainer';
import QuestionnaireForm from './../../questionnaires/QuestionnaireFormContainer';

class Routes extends Component {
  render() {
    return (
      <Router history={hashHistory}>
        <Route path="/" component={QuestionnaireAdmin} />
        <Route path="/questionnaire" component={QuestionnaireForm} />
      </Router>
    );
  }
}

export default Routes;