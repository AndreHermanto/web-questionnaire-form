import React from 'react';
import get from 'lodash.get';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import toJS from './toJS';

const ButtonBackgroundColor = {
  review: '#fff',
  start: '#fff',
  resume: '#00437E'
};
const ButtonColor = { review: '#AAAAAA', start: '#00437E', resume: '#fff' };
const ButtonBorder = {
  review: '1px solid #AAAAAA',
  start: '1px solid #00437E',
  resume: '1px solid #00437E'
};

const ButtonBackgroundColorHover = {
  review: '#2CC36B',
  start: '#00437E',
  resume: '#fff'
};
const ButtonColorHover = { review: '#fff', start: '#fff', resume: '#00437E' };

const DashboardContainer = styled.div`
  background-color: #fff;
  padding: 0px 30px 60px 30px;
  @media screen and (max-width: 480px) {
    padding: 0px 0px 60px 0px;
  }
  margin: 80px 0px 80px 0px;
  border: 1px solid #C9C9C9;
`;

const DashboardHeader = styled.div`
  height: 200px;
  margin-bottom: 30px;
`;

const HeaderIconContainer = styled.div`
  position: relative;
  top: 35px;
  margin: 0 auto;
  width: 300px;
  height: 100px;
`;

const PaperIcon = styled.div`
  position: relative;
  margin: 0 auto;
  width: 50px;
  height: 50px;
  left: -5px;
  margin-bottom: 12px;
  background-image: url(static/media/paper-stack.f5ce4eac.svg);
`;

const Line = styled.hr`
  position: relative;
  top: 50px;
  border-top: 1px solid #C9C9C9;
  opacity: 0.5;
`;

const QuestionnairesContainer = styled.div`
  position: relative;
  min-height: 200px;
  margin-bottom: 20px;
`;

const QuestionnaireList = styled.ul`
  padding: 0;
  list-style-type: none;
`;

const QuestionnairesList = styled.li`
  position: relative;
  min-height: 70px;
  width: 100%;
  background-color: #F8F8FB;
  border: 1px solid #C9C9C9;
  margin: 15px 0px 15px 0px;
`;

const QuestionnairesListCompleted = styled.li`
  position: relative;
  min-height: 70px;
  width: 100%;
  background-color: #F8F8FB;
  border: 1px solid #C9C9C9;
  margin: 15px 0px 15px 0px;
  background-color: #fff;
  border: 1px solid #2CC36B;
`;

const QuestionnaireInfo = styled.div`
  position: relative;
  display: block;
  overflow: auto;
  width: 70%;
  padding: 12px;
  float: left;
`;

const QuestionnaireInfoCompleted = styled.div`
  position: relative;
  display: block;
  overflow: auto;
  width: 70%;
  padding: 12px;
  float: left;
  padding-left: 50px;
  padding-top: 21px;
`;

const PercentageCompleteContainer = styled.div`
  width: 100%;
  height: 6px;
  background-color: #fff;
  border-radius: 12px;
  margin-top: 7px;
  border: 1px solid #C9C9C9;
`;

const PercentageCompleteFill = styled.div`
  height: 5px;
  border-radius: 12px;
  background-color: #00437E;
`;

const TickIcon = styled.div`
  position: absolute;
  width: 18px;
  height: 18px;
  left: 17px;
  top: 26px;
  background-image: url(static/media/checked.43039e78.svg);
  background-size: contain;
`;

const Percentage = styled.span`
  color: #AAAAAA;
  font-weight: 400;
  display: block;
  font-size: 12px;
  font-family: 'Nunito Sans', sans-serif;
  line-height: 12px;
  margin-bottom: 3px;
  letter-spacing: 1px;
`;

const ModuleHeader = styled.span`
  color: ${props => (props.completed ? '#2CC36B' : '#00437E')};
  font-weight: 800;
  display: block;
  font-size: 12px;
  font-family: 'Nunito Sans', sans-serif;
  line-height: 12px;
  margin-bottom: 3px;
  letter-spacing: 1px;
`;

const DashboardIntro = styled.div`
  margin: 60px 0px 0px 0px;
`;

const Header = styled.h2`
  font-size: 24px;
  font-family: 'Nunito Sans', sans-serif;
  font-weight: 700;
  letter-spacing: 1px;
  margin: 5px 0px 0px 0px;
  color: ${props => props.color};
`;

const SubHeader = styled.h3`
  font-family: 'Nunito Sans', sans-serif;
  font-weight: 800;
  font-size: 13px;
  letter-spacing: 1px;
  color: #fff;
  text-align: center;
  margin: 5px 0px 0px 0px;
  color: ${props => props.color};
  font-weight: ${props => props.fw};
`;

const Description = styled.p`
  font-size: 12px;
  font-family: 'Nunito Sans', sans-serif;
  font-weight: 400;
  color: #767676;
  margin-top: 25px;
  max-width: 500px;
  letter-spacing: 1px;
`;

const DashboardButton = styled.a`
  display: block;
  position: relative;
  float: right;
  top: 14px;
  right: 12px;
  width: 75px;
  height: 40px;
  border-radius: 3px;
  font-size: 9px;
  font-family: 'Nunito Sans', sans-serif;
  font-weight: 800;
  text-align: center;
  letter-spacing: 1px;
  line-height: 40px;
  cursor: pointer;

  background-color: ${props => ButtonBackgroundColor[props.type]};
  color: ${props => ButtonColor[props.type]};
  border: ${props => ButtonBorder[props.type]};

  &:hover {
    background-color: ${props => ButtonBackgroundColorHover[props.type]};
    color: ${props => ButtonColorHover[props.type]};
    border: ${props => (props.type === 'review' ? '1px solid #2CC36B' : null)}
  }
`;

function QuestionnaireDashboard(props) {
  const { items, userId } = props;
  console.log('props', props);
  // let items;
  if (!items) {
    return <div>Loading...</div>;
  }
  return (
    <div className="container">
      <DashboardIntro>
        <Header color="#00437E">Welcome back</Header>
        <Header color="#62A5DB">Its time to complete your profile</Header>
        <Description>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
          vitae purus eleifend, faucibus velit at, feugiat risus. Donec mauris
          magna, rhoncus quis tristique a, facilisis eget metus. In et dolor
          arcu. Fusce at diam dui. Vestibulum sed lacinia mauris, sit amet
          vestibulum lorem. Class aptent taciti sociosqu ad litora torquent per
          conubia nostra, per inceptos himenaeos.
        </Description>
      </DashboardIntro>
      <DashboardContainer className="row">
        <DashboardHeader className="col-xs-12">
          <HeaderIconContainer>
            <PaperIcon />
            <SubHeader color="#00437E">PROFILE QUESTIONS</SubHeader>
            <SubHeader color="#AAAAAA" fw="400">
              {/* 3 of  */}
              {items.length} questionnaires
            </SubHeader>
          </HeaderIconContainer>
          <Line />
        </DashboardHeader>
        <div className="col-xs-12 col-sm-12">
          <QuestionnairesContainer>
            <SubHeader color="#00437E">Questionnaires</SubHeader>
            <QuestionnaireList>
              {items.map(version => {
                if (!version) {
                  return <div>loading</div>;
                }
                return (
                  <QuestionnairesList>
                    <QuestionnaireInfo>
                      <ModuleHeader>
                        {version.title}
                      </ModuleHeader>
                      <Percentage />
                      <PercentageCompleteContainer>
                        <PercentageCompleteFill style={{ width: '0%' }}>
                          {' '}
                        </PercentageCompleteFill>
                      </PercentageCompleteContainer>
                    </QuestionnaireInfo>
                    {get(version, 'response.completed', false) &&
                      <DashboardButton type="review">Done</DashboardButton>}
                    {!get(version, 'response.completed', false) &&
                      <DashboardButton
                        type="resume"
                        href={`#/users/${userId}/questionnaires/${version.questionnaireId}?resume=true`}
                      >
                        {version.response ? 'RESUME' : 'START'}
                      </DashboardButton>}
                  </QuestionnairesList>
                );
              })}
            </QuestionnaireList>
            {/* <SubHeader color="#00437E">TO DO</SubHeader>
            <QuestionnaireList>
              <QuestionnairesList>
                <QuestionnaireInfo>
                  <ModuleHeader>
                    Self-Phenotyping
                  </ModuleHeader>
                  <Percentage>0% complete</Percentage>
                  <PercentageCompleteContainer>
                    <PercentageCompleteFill style={{ width: '2%' }}>
                      {' '}
                    </PercentageCompleteFill>
                  </PercentageCompleteContainer>
                </QuestionnaireInfo>
                <DashboardButton type="start">START</DashboardButton>
              </QuestionnairesList>
              <QuestionnairesList>
                <QuestionnaireInfo>
                  <ModuleHeader>
                    Screening questionnaire
                  </ModuleHeader>
                  <Percentage>0% complete</Percentage>
                  <PercentageCompleteContainer>
                    <PercentageCompleteFill style={{ width: '2%' }}>
                      {' '}
                    </PercentageCompleteFill>
                  </PercentageCompleteContainer>
                </QuestionnaireInfo>
                <DashboardButton type="start">START</DashboardButton>
              </QuestionnairesList>
            </QuestionnaireList> */}
          </QuestionnairesContainer>
        </div>
        {/* <div className="col-xs-12 col-sm-6">
          <QuestionnairesContainer> */}
        {/* <SubHeader color="#2CC36B">COMPLETED</SubHeader>
            <QuestionnaireList>
              <QuestionnairesListCompleted>
                <QuestionnaireInfoCompleted>
                  <TickIcon />
                  <ModuleHeader completed>
                    Exposure A
                  </ModuleHeader>
                  <Percentage>
                    100% complete
                  </Percentage>
                </QuestionnaireInfoCompleted>
                <DashboardButton type="review">REVIEW</DashboardButton>
              </QuestionnairesListCompleted>
              <QuestionnairesListCompleted>
                <QuestionnaireInfoCompleted>
                  <TickIcon />
                  <ModuleHeader completed>
                    Exposure B
                  </ModuleHeader>
                  <Percentage>
                    100% complete
                  </Percentage>
                </QuestionnaireInfoCompleted>
                <DashboardButton type="review">REVIEW</DashboardButton>
              </QuestionnairesListCompleted>
              <QuestionnairesListCompleted>
                <QuestionnaireInfoCompleted>
                  <TickIcon />
                  <ModuleHeader completed>
                    Exposure C
                  </ModuleHeader>
                  <Percentage>
                    100% complete
                  </Percentage>
                </QuestionnaireInfoCompleted>
                <DashboardButton type="review">REVIEW</DashboardButton>
              </QuestionnairesListCompleted>
            </QuestionnaireList> */}
        {/* </QuestionnairesContainer>
        </div> */}
      </DashboardContainer>
    </div>
  );
}

export default toJS(QuestionnaireDashboard);
