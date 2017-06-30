import React from 'react';
import { Col } from 'react-bootstrap';
import styled from 'styled-components';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

const PreviewContainer = styled(Col)`
  background-color: white; 
  padding: 24px; 
  border: 1px solid  rgb(227, 231, 241);
  margin-top: 10px;
  margin-bottom: 10px;
`;

const DisplayText = styled.div`
  text-align: center;
  padding-top: 30px;
`;
const ButtonText = styled(Link)`
  color: #fff;
  text-decoration: none;
  &:hover {
    color: #fff;
    text-decoration: none;
  }
`;

const propTypes = {
  questionnaire: PropTypes.instanceOf(Immutable.Map).isRequired,
  resume: PropTypes.string.isRequired,
  displayText: PropTypes.func.isRequired
};

function QuestionnaireStartPage({ questionnaire, resume, displayText }) {
  return (
    <PreviewContainer md={12}>
      {questionnaire.get('startPage') &&
        <img
          src={questionnaire.get('startPage').get('image')}
          style={{ margin: 'auto' }}
          alt=""
          className="img-responsive"
        />}
      {questionnaire.get('startPage') &&
        <DisplayText>
          {displayText(
            questionnaire.get('startPage').get('text').split(/\r?\n/),
            questionnaire.get('startPage').get('fontSize'),
            questionnaire.get('startPage').get('color'),
            questionnaire.get('startPage').get('isItalic'),
            questionnaire.get('startPage').get('isBold')
          )}
        </DisplayText>}
      {questionnaire.get('startPage') &&
        questionnaire.get('startPage').get('buttonText') !== '' &&
        <div style={{ margin: 'auto', textAlign: 'center', paddingTop: 30 }}>
          <button className="btn btn-primary btn-lg">
            <ButtonText
              to={`/users/admin/questionnaires/${questionnaire.get(
                'questionnaireId'
              )}?resume=${resume}&showlogic=true`}
            >
              {questionnaire.get('startPage').get('buttonText')}
            </ButtonText>
          </button>
        </div>}
    </PreviewContainer>
  );
}

QuestionnaireStartPage.propTypes = propTypes;

export default QuestionnaireStartPage;
