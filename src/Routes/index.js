import React, { Component } from 'react';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import PatientHomeContainer from '../containers/PatientHomeContainer';
import QuestionnaireAdminContainer
  from '../containers/QuestionnaireAdminContainer';
import QuestionnaireForm from '../containers/QuestionnaireFormContainer';
import QuestionnaireSummaryContainer
  from '../containers/QuestionnaireSummaryContainer';
import QuestionnaireFormSubmittedContainer
  from '../containers/QuestionnaireFormSubmittedContainer';
import Container from '../components/Container';

class Routes extends Component {
  render() {
    // How this is structured https://medium.com/@dabit3/beginner-s-guide-to-react-router-53094349669#.eak1uik49
    return (
      <Router history={hashHistory}>
        <Route path="/" component={Container}>
          <IndexRoute component={QuestionnaireAdminContainer} />
          <Route
            path="/users/:userId/:consentTypeId/:questionnaireId(?resume:resume)(?showlogic=:showlogic)(?timestamp=:timestamp)"
            component={QuestionnaireForm}
          />
          <Route
            path="/users/:userId/:consentTypeId/:questionnaireId/preview(?resume:resume)(?showlogic=:showlogic)(?timestamp=:timestamp)"
            component={QuestionnaireForm}
          />
          <Route
            path="/users/:encryptedUserId/:encryptedConsentTypeId/:responseId/end"
            component={QuestionnaireSummaryContainer}
          />
          <Route
            path="/submitted"
            component={QuestionnaireFormSubmittedContainer}
          />
          <Route
            path="/home/:userId/:consentTypeId(?timestamp=:timestamp)"
            component={PatientHomeContainer}
          />
        </Route>
      </Router>
    );
  }
}

export default Routes;
