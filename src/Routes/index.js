import React, { Component } from 'react';
import { Route, HashRouter, withRouter, Switch } from 'react-router-dom';
import { Dimmer, Loader } from 'semantic-ui-react';
import PatientHomeContainer from '../containers/PatientHomeContainer';
import QuestionnaireAdminContainer from '../containers/QuestionnaireAdminContainer';
import QuestionnaireForm from '../containers/QuestionnaireFormContainer';
import QuestionnaireSummaryContainer from '../containers/QuestionnaireSummaryContainer';
import QuestionnaireFormSubmittedContainer from '../containers/QuestionnaireFormSubmittedContainer';
import { EnsureLoggedInContainer } from 'web-component-authentication';
const EnsureLoggedInContainerWithRouter = withRouter(EnsureLoggedInContainer);

class Routes extends Component {
  render() {
    // How this is structured https://medium.com/@dabit3/beginner-s-guide-to-react-router-53094349669#.eak1uik49
    return (
      <HashRouter>
        <EnsureLoggedInContainerWithRouter
          onLoading={() => (
            <div>
              <Dimmer active inverted>
                <Loader inverted>Checking user details...</Loader>
              </Dimmer>
            </div>
          )}
          onNoAuthToken={() => (
            <div style={{ textAlign: 'center' }}>
              Sorry, you are not logged in.
            </div>
          )}
        >
          <Switch>
            <Route exact path="/" component={QuestionnaireAdminContainer} />
            <Route
              path="/users/:userId/:consentTypeId/:questionnaireId"
              component={QuestionnaireForm}
            />
            <Route
              path="/users/:userId/:consentTypeId/:questionnaireId/preview"
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
              path="/home/:userId/:consentTypeId"
              component={PatientHomeContainer}
            />
          </Switch>
        </EnsureLoggedInContainerWithRouter>
      </HashRouter>
    );
  }
}

export default Routes;
