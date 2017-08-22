import React from 'react';
import { Grid, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import styled from 'styled-components';

const DisplayText = styled.div`
  text-align: center !important;
  padding-top: 30px;
`;

const DisplayButton = styled.div`
  margin: auto;
  text-align: center;
  padding-top: 30px;
`;

const propTypes = {
  version: PropTypes.instanceOf(Immutable.Map).isRequired,
  displayText: PropTypes.func.isRequired
};

function QuestionnaireFormSubmitted({ version, displayText }) {
  return (
    <Grid>
      {version && version.get('endPage')
        ? <Col md={12}>
            <img
              src={version.getIn(['endPage', 'image'])}
              style={{ margin: 'auto' }}
              alt=""
              className="img-responsive"
            />
            <DisplayText>
              {displayText(
                version.getIn(['endPage', 'text']).split(/\r?\n/),
                version.getIn(['endPage', 'fontSize']),
                version.getIn(['endPage', 'color']),
                version.getIn(['endPage', 'isItalic']),
                version.getIn(['endPage', 'isBold'])
              )}
            </DisplayText>
            {version.getIn(['endPage', 'buttonText']) !== '' &&
              <DisplayButton>
                <a className="btn btn-primary btn-lg" href="/">
                  {' '}{version.getIn(['endPage', 'buttonText'])}{' '}
                </a>
              </DisplayButton>}
          </Col>
        : <div>
            <h1>Thanks!</h1>
            <p>Your response has been submitted.</p>
          </div>}
    </Grid>
  );
}
QuestionnaireFormSubmitted.propTypes = propTypes;

export default QuestionnaireFormSubmitted;
