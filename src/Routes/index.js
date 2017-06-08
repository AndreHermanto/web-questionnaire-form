import React, { Component } from 'react';
import {
  Router,
  Route,
  hashHistory,
  IndexRoute
} from 'react-router';
import QuestionnaireAdminContainer from '../containers/QuestionnaireAdminContainer';
import QuestionnaireForm from '../containers/QuestionnaireFormContainer';
import QuestionnaireFormSubmitted from '../components/QuestionnaireFormSubmitted';
import Container from '../components/Container';

class Routes extends Component {
  render() {
    // How this is structured https://medium.com/@dabit3/beginner-s-guide-to-react-router-53094349669#.eak1uik49
    return (
      <Router history={hashHistory}>
        <Route path="/" component={Container}>
          <IndexRoute component={QuestionnaireAdminContainer} />
          <Route path="/users/:userId/questionnaires/:questionnaireId(?resume:resume)(?showlogic=:showlogic)" component={QuestionnaireForm} />
          <Route path="/submitted" component={QuestionnaireFormSubmitted} />
        </Route>
      </Router>
    );
  }
}

export default Routes;
