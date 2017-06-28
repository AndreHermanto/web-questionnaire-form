import React from 'react';
import Summary from './Summary';
import Heading from './Heading';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Header = styled.h2`text-align: center;`;

const ButtonContainer = styled.div`
  margin: 0 auto;
  width: 200px;
`;

const propTypes = {
  questions: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  isCompleted: PropTypes.bool.isRequired
};

const defaultProps = {};

function QuestionnaireSummary(props) {
  return (
    <div className="container">
      <Header>Summary</Header>
      {props.questions.map((question, index) => {
        const { element, responseElement } = question;
        if (!element || !responseElement) {
          return <div>Loading question and reponse...</div>;
        }
        if (element.get('type') === 'textinformation') {
          return (
            <div key={responseElement.get('id')}>
              <div
                style={{ marginBottom: 15 }}
                name={responseElement.get('id')}
              >
                {element.get('text').split('\n').map(item => (
                  <span key={item}>
                    {item}
                    <br />
                  </span>
                ))}
              </div>
            </div>
          );
        }

        // section heading
        if (element.get('type') === 'section') {
          return (
            <div key={responseElement.get('id')}>
              <h2
                style={{ marginBottom: 32, marginTop: 40 }}
                className="text-capitalize"
              />
              <Heading
                text={element.get('title')}
                size={element.get('size')}
                name={responseElement.get('id')}
              />
            </div>
          );
        }

        return (
          <div key={responseElement.get('id')}>
            <Summary
              name={responseElement.get('id')}
              key={question.responseElement.get('id')}
              element={element}
              number={index + 1}
              responseElement={responseElement}
            />
          </div>
        );
      })}
      {!props.isCompleted &&
        <ButtonContainer>
          <button className="btn btn-primary btn-lg" onClick={props.onSubmit}>
            Submit
          </button>{' '}
          <button className="btn btn-default btn-lg" onClick={props.onEdit}>
            Edit
          </button>
        </ButtonContainer>}
      <br />
    </div>
  );
}

QuestionnaireSummary.propTypes = propTypes;
QuestionnaireSummary.defaultProps = defaultProps;

export default QuestionnaireSummary;
