import React from 'react';
import styled from 'styled-components';
import { Grid, Col, Row } from 'react-bootstrap';
import FailedToDecryptMessage from './FailedToDecryptMessage';
import Questionnaire from './Questionnaire';
import Footer from './Footer';
import Payment from './Payment';

const DashboardIntro = styled.div`margin: 60px 0px 0px 0px;`;

const Header = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin: 5px 0px 0px 0px;
  color: ${props => props.color};
`;

const Description = styled.p`
  font-weight: 400;
  color: #767676;
  margin-top: 25px;
  max-width: 500px;
`;

function QuestionnaireDashboard(props) {
  // let props.questionnaires;
  if (!props.questionnaires) {
    return <div>Loading...</div>;
  }
  if (props.failedToDecrypt) {
    return (
      <Grid>
        <FailedToDecryptMessage />
      </Grid>
    );
  }
  const hasCompletedAllQuestionnaires = props.questionnaires.reduce(
    (completed, version) => {
      return (
        completed && version && version.response && version.response.completed
      );
    },
    true
  );

  return (
    <div style={{ position: 'relative', minHeight: '100%' }}>
      <div className="container" style={{ paddingBottom: 120 }}>
        <DashboardIntro>
          <Header color="#00437E">Welcome back</Header>
          <Header color="#62A5DB">It is time to complete your profile</Header>
          <Description>
            We are excited to help you build your health and exposure history
            profile. Each survey that you complete contributes to a profile that
            is specific to you. The information that you provide in the surveys
            will improve your diagnostic testing and risk prediction. Thank you
            for allowing us to be a part of your healthcare journey. We value
            your time and effort in taking steps to help us better care for you.
            Please begin your survey or complete your unfinished survey.
          </Description>
        </DashboardIntro>

        <h2 style={{ fontSize: 16, padding: '24px 0 24px 0', color: '#666' }}>
          Questionnaires
        </h2>
        {hasCompletedAllQuestionnaires && (
          <h3 style={{ fontSize: 16, marginBottom: '32', color: '#666' }}>
            Congratulations! You have completed all your assigned surveys.
          </h3>
        )}
        <Row>
          {props.questionnaires.map((version, i) => {
            if (!version) {
              return <div key={i}>loading</div>;
            }
            return (
              <Col sm={4} style={{ marginBottom: 32 }} key={i}>
                <Questionnaire
                  completed={version.response && version.response.completed}
                  title={version.title}
                  timeInMinutes={version.time}
                  percentComplete={
                    version.response ? version.response.completed ? (
                      100
                    ) : (
                      Math.random() * 20 + 10
                    ) : (
                      0
                    )
                  }
                  buttonText={
                    version.response ? version.response.completed ? (
                      'Completed'
                    ) : (
                      'Resume'
                    ) : (
                      'Start'
                    )
                  }
                  link={
                    version.response && version.response.completed ? (
                      `#/users/${encodeURIComponent(
                        props.encryptedUserId
                      )}/${encodeURIComponent(
                        props.encryptedConsentTypeId
                      )}/${encodeURIComponent(version.response.id)}/end`
                    ) : (
                      `#/users/${encodeURIComponent(
                        props.encryptedUserId
                      )}/${encodeURIComponent(
                        props.encryptedConsentTypeId
                      )}/${encodeURIComponent(version.questionnaireId)}`
                    )
                  }
                  status={
                    version.response ? version.response.completed ? (
                      'Completed'
                    ) : (
                      'In Progress'
                    ) : (
                      'New'
                    )
                  }
                />
              </Col>
            );
          })}
        </Row>

        {hasCompletedAllQuestionnaires && (
          <Payment
            payment={props.payment}
            isPaid={props.isPaid}
            consentTypeId={props.encryptedConsentTypeId}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}

export default QuestionnaireDashboard;
