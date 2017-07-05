import React from 'react';
import Summary from './Summary';
import Heading from './Heading';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import StartEndText from './StartEndText';

const Header = styled.h2`text-align: center;`;

const propTypes = {
  questions: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  isCompleted: PropTypes.bool.isRequired
};

const defaultProps = {};

function QuestionnaireSummary(props) {
  const { endPage } = props;
  return (
    <div className="container">
      <div
        style={{
          marginBottom: 24,
          backgroundColor: 'white',
          border: '1px solid #eee',
          padding: 32
        }}
      >
        {endPage &&
          <div>
            <StartEndText
              text={endPage.get('text')}
              fontSize={endPage.get('fontSize')}
              color={endPage.get('color')}
              isItalic={endPage.get('isItalic')}
              isBold={endPage.get('isBold')}
            />
            {endPage.get('image') &&
              <img
                src={endPage.get('image')}
                style={{ margin: 'auto' }}
                alt=""
                className="img-responsive"
              />}
          </div>}
      </div>
      <Header>Summary</Header>
      <p>
        Below is a summary of your answers. You may print these for your records.
      </p>
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
    </div>
  );
}

QuestionnaireSummary.propTypes = propTypes;
QuestionnaireSummary.defaultProps = defaultProps;

export default QuestionnaireSummary;
