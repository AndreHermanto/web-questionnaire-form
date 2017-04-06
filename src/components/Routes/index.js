import React, { Component } from 'react';
import {
  Router,
  Route,
  hashHistory,
  IndexRoute
} from 'react-router';
import QuestionnaireAdmin from '../../questionnaires/QuestionnaireAdminContainer';
import QuestionnaireForm from '../../questionnaires/QuestionnaireFormContainer';
import QuestionnaireFormSubmitted from '../../questionnaires/QuestionnaireFormSubmitted';
import Container from '../Container';

class Routes extends Component {
  render() {
    // How this is structured https://medium.com/@dabit3/beginner-s-guide-to-react-router-53094349669#.eak1uik49
    return (
      <Router history={hashHistory}>
        <Route path="/" component={Container}>
          <IndexRoute component={QuestionnaireAdmin} />
          <Route path="/users/:userId/questionnaires/:questionnaireId" component={QuestionnaireForm} />
          <Route path="/submitted" component={QuestionnaireFormSubmitted} />
        </Route>
      </Router>
    );
  }
}

export default Routes;
