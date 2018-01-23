import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message } from 'semantic-ui-react';
const OuterBox = styled.div`
  -webkit-box-shadow: 2px 10px 38px -6px rgba(223, 234, 248, 1);
  -moz-box-shadow: 2px 10px 38px -6px rgba(223, 234, 248, 1);
  box-shadow: 2px 10px 38px -6px rgba(223, 234, 248, 1);
  border: 1px solid #dfe8f5;
`;
const ColoredSection = styled.a`
  display: block;
  background: ${props => (props.completed ? 'grey' : '#00437e')};
  height: 150px;
  color: white;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: thin;
  position: relative;
  padding: 8px;
  &:hover {
    text-decoration: none;
    color: white;
  }
`;
const WhiteSection = styled.div`
  padding: 16px;
  background-color: white;
`;
class Questionnaire extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    buttonText: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    percentComplete: PropTypes.number.isRequired,
    timeInMinutes: PropTypes.number.isRequired,
    completed: PropTypes.bool.isRequired,
    requiresPayment: PropTypes.bool.isRequired,
    isError: PropTypes.bool.isRequired
  };
  renderButton = () => {
    if (this.props.isError) {
      return (
        <Message negative>
          <Message.Header>Error</Message.Header>
          <p>This questionnaire has no questions</p>
        </Message>
      );
    }

    if (this.props.requiresPayment && !this.props.completed) {
      return (
        <Message info>
          <p>Enabled after payment</p>
        </Message>
      );
    }

    return (
      <a
        href={this.props.link}
        className="btn btn-primary btn-block"
        style={{
          backgroundColor: this.props.completed ? 'rgb(82, 88, 93)' : '#192229',
          border: 'none',
          borderRadius: 3,
          padding: '12px 16px'
        }}
      >
        {this.props.buttonText}
      </a>
    );
  };

  render() {
    return (
      <OuterBox>
        <ColoredSection completed={this.props.completed}>
          {this.props.title}
        </ColoredSection>
        {true && (
          <div
            style={{
              height: '3px',
              backgroundColor: '#192229',
              width: `${this.props.percentComplete}%`
            }}
          />
        )}

        <WhiteSection>
          {this.props.completed && (
            <div style={{ marginBottom: 16 }}>
              Thank you for completing this survey.
            </div>
          )}
          {true && (
            <div>
              {!this.props.completed && (
                <div style={{ marginBottom: 16 }}>
                  Estimated Time: Less than{' '}
                  {Math.floor(this.props.timeInMinutes)} minutes
                </div>
              )}
              <div>{this.renderButton()}</div>
            </div>
          )}
        </WhiteSection>
      </OuterBox>
    );
  }
}

export default Questionnaire;
