import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Col } from 'react-bootstrap';
import {
  getCurrentVersion
} from '../../reducers';
import styled from 'styled-components';
const DisplayText = styled.div`
  fontSize: 20px; 
  textAlign: center;
  fontStyle: ${props => props.isItalic ? 'italic' : 'normal' };
  fontWeight: ${props => props.isBold ? 'bold' : 'normal'};
  padding-top: 20px;
`;

const DisplayButton = styled.div`
  margin: auto;
  textAlign: center;
  marginBottom: 10px;
  padding-top: 20px;
`;

class QuestionnaireFormSubmitted extends Component {
  render() {
    return (
      <Grid>
      {
        this.props.version && this.props.version.toJSON().endPage ? 
        <Col md={12}>
          <img src={this.props.version.toJSON().endPage.image} style={{margin:'auto'}} alt="" className="img-responsive"/>
          <DisplayText isItalic={this.props.version.toJSON().endPage.isItalic} isBold={this.props.version.toJSON().endPage.isBold}>
            {this.props.version.toJSON().endPage.text}
          </DisplayText>
          {
            this.props.version.toJSON().endPage.buttonText !== '' &&
            <DisplayButton>
              <a className='btn btn-primary btn-lg' href='#'> {this.props.version.toJSON().endPage.buttonText} </a>
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
}

function mapStateToProps(state, ownProps) {
  const props = {
    version: getCurrentVersion(state)
  };
  return props;
}

export default connect(mapStateToProps)(QuestionnaireFormSubmitted);