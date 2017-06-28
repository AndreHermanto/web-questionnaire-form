import React from 'react';
import { Grid, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import styled from 'styled-components';
const DisplayText = styled.div`
  fontSize: 20px; 
  textAlign: center;
  font-style: ${props => props.isItalic ? 'italic' : 'normal' };
  font-weight: ${props => props.isBold ? 'bold' : 'normal'};
  font-size: ${props => props.font ? `${props.font}px` : '20px'} !important;
  color: ${props => props.color ? props.color : '#333'};
  padding-top: 20px;
`;

const DisplayButton = styled.div`
  margin: auto;
  text-align: center;
  margin-bottom: 10px;
  padding-top: 20px;
`;

const propTypes = {
  version: PropTypes.instanceOf(Immutable.Map).isRequired
};

function QuestionnaireFormSubmitted({
  version
}) {
    return (
      <Grid>
      {
        version && version.get('endPage') ? 
        <Col md={12}>
          <img src={version.getIn(['endPage','image'])} style={{margin:'auto'}} alt="" className="img-responsive"/>
          <DisplayText font={version.getIn(['endPage','fontSize'])} color={version.getIn(['endPage','color'])} 
            isItalic={version.getIn(['endPage','isItalic'])} isBold={version.getIn(['endPage','isBold'])}>
            {version.getIn(['endPage','text'])}
          </DisplayText>
          {
            version.getIn(['endPage','buttonText'])!== '' &&
            <DisplayButton>
              <a className='btn btn-primary btn-lg' href='#'> {version.getIn(['endPage','buttonText'])} </a>
            </DisplayButton>
          }
        </Col>
        :
        <div>
          <h1>Thanks!</h1>
          <p>Your response has been submitted.</p>
        </div>
      }
      </Grid>
    );
}
QuestionnaireFormSubmitted.propTypes = propTypes;

export default QuestionnaireFormSubmitted;
