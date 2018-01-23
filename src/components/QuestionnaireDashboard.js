import React from 'react';
import styled from 'styled-components';
import { Grid, Col, Row } from 'react-bootstrap';
import FailedToDecryptMessage from './FailedToDecryptMessage';
import Questionnaire from './Questionnaire';
import Footer from './Footer';
import Payment from './Payment';
import Markdown from 'react-markdown';
import { Dimmer, Loader } from 'semantic-ui-react';
import { getCompletedQuestionnaires } from '../helpers/questionnaires';

const DashboardIntro = styled.div`
  margin: 60px 0px 20px 0px;
`;

const Header = styled.h2`
  font-size: 24px;
  margin: 10px 0px 0px 0px;
  color: ${props => props.color};
  word-break: break-all;
`;

function QuestionnaireDashboard(props) {
  const loading = key => {
    return (
      <Dimmer key={key} active inverted>
        <Loader indeterminate size="large">
          Preparing Questionnaires
        </Loader>
      </Dimmer>
    );
  };

  if (props.failedToDecrypt) {
    return (
      <Grid>
        <FailedToDecryptMessage />
      </Grid>
    );
  }
  const hasCompletedQuestionnaires = getCompletedQuestionnaires(
    props.questionnaires
  );

  if (props.isLoadingReponses && !props.questionnaires) {
    return loading();
  }
  return (
    <div style={{ position: 'relative', minHeight: '100%' }}>
      <div className="container" style={{ paddingBottom: 120 }}>
        {props.landingPage.title && (
          <DashboardIntro>
            <Header color="#00437E">
              <Markdown
                source={props.landingPage.title}
                escapeHtml={true}
                skipHtml={true}
              />
            </Header>
            <Header color="#62A5DB">
              <Markdown
                source={props.landingPage.heading}
                escapeHtml={true}
                skipHtml={true}
              />
            </Header>
            <div style={{ wordBreak: 'break-all', marginTop: 10 }}>
              <Markdown
                source={props.landingPage.text}
                escapeHtml={true}
                skipHtml={true}
              />
            </div>
          </DashboardIntro>
        )}

        {/* All questionnaires finished, but has price plans */}
        {hasCompletedQuestionnaires.beforePayment &&
          props.pricePlanId && (
            <Payment
              pricePlanId={props.pricePlanId}
              pricePlans={props.pricePlans}
              fetchPricePlan={props.fetchPricePlan}
              isPaid={props.isPaid}
              consentTypeId={props.encryptedConsentTypeId}
            />
          )}

        <Row>
          {props.questionnaires.length > 0 && (
            <h2
              style={{
                fontSize: 16,
                padding: '24px 0 24px 0',
                color: '#666'
              }}
            >
              Questionnaires
            </h2>
          )}

          {props.questionnaires.map((version, i) => {
            if (!version) {
              return loading(i);
            }
            return (
              <Col sm={4} style={{ marginBottom: 32 }} key={i}>
                <Questionnaire
                  completed={
                    (version.response && version.response.completed) || false
                  }
                  title={version.title}
                  timeInMinutes={version.time}
                  percentComplete={
                    version.response
                      ? version.response.completed
                        ? 100
                        : Math.random() * 20 + 10
                      : 0
                  }
                  buttonText={
                    version.response
                      ? version.response.completed ? 'Completed' : 'Resume'
                      : 'Start'
                  }
                  link={
                    version.response && version.response.completed
                      ? `#/users/${encodeURIComponent(
                          props.encryptedUserId
                        )}/${encodeURIComponent(
                          props.encryptedConsentTypeId
                        )}/${encodeURIComponent(version.response.id)}/end`
                      : `#/users/${encodeURIComponent(
                          props.encryptedUserId
                        )}/${encodeURIComponent(
                          props.encryptedConsentTypeId
                        )}/${encodeURIComponent(version.questionnaireId)}`
                  }
                  status={
                    version.response
                      ? version.response.completed ? 'Completed' : 'In Progress'
                      : 'New'
                  }
                  isError={version.body.length > 0 ? false : true}
                  requiresPayment={
                    version.afterPayment && (props.pricePlanId && !props.isPaid)
                      ? true
                      : false
                  }
                />
              </Col>
            );
          })}
        </Row>

        {/* All questionnaires finished, no price plans */}
        {hasCompletedQuestionnaires.all &&
          props.questionnaires.length > 0 &&
          !props.pricePlanId && (
            <h3 style={{ fontSize: 16, marginBottom: 32, color: '#666' }}>
              Congratulations! You have completed all your assigned surveys.
            </h3>
          )}
      </div>
      <Footer />
    </div>
  );
}

export default QuestionnaireDashboard;
