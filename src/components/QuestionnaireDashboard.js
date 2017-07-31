import React from 'react';
import styled from 'styled-components';
import { Grid, Col, Row } from 'react-bootstrap';
import FailedToDecryptMessage from './FailedToDecryptMessage';
import Questionnaire from './Questionnaire';

const DashboardIntro = styled.div`
  margin: 60px 0px 0px 0px;
`;

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
  return (
    <div className="container">
      <DashboardIntro>
        <Header color="#00437E">Welcome back</Header>
        <Header color="#62A5DB">
          Its time to complete your profile v1.0.0
        </Header>
        <Description>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
          vitae purus eleifend, faucibus velit at, feugiat risus. Donec mauris
          magna, rhoncus quis tristique a, facilisis eget metus. In et dolor
          arcu. Fusce at diam dui. Vestibulum sed lacinia mauris, sit amet
          vestibulum lorem. Class aptent taciti sociosqu ad litora torquent per
          conubia nostra, per inceptos himenaeos.
        </Description>
      </DashboardIntro>

      <h2 style={{ fontSize: 16, padding: '24px 0 24px 0', color: '#666' }}>
        Questionnaires
      </h2>
      <Row style={{ marginBottom: 64 }}>
        {props.questionnaires.map(version => {
          if (!version) {
            return <div>loading</div>;
          }
          return (
            <Col sm={'4'} style={{ marginBottom: 32 }}>
              <Questionnaire
                completed={version.response && version.response.completed}
                title={version.title}
                questionCount={version.body.length}
                percentComplete={
                  version.response
                    ? version.response.completed ? 100 : Math.random() * 20 + 10
                    : 0
                }
                buttonText={
                  version.response
                    ? version.response.completed ? 'Completed' : 'Resume'
                    : 'Start'
                }
                link={
                  version.response && version.response.completed
                    ? `#/users/${encodeURIComponent(props.encryptedUserId)}/${encodeURIComponent(props.encryptedConsentTypeId)}/${encodeURIComponent(version.response.id)}/end`
                    : `#/users/${encodeURIComponent(props.encryptedUserId)}/${encodeURIComponent(props.encryptedConsentTypeId)}/${encodeURIComponent(version.questionnaireId)}`
                }
                status={
                  version.response
                    ? version.response.completed ? 'Completed' : 'In Progress'
                    : 'New'
                }
              />
            </Col>
          );
        })}
      </Row>
    </div>
  );
}

export default QuestionnaireDashboard;
