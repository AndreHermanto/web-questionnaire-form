import React from 'react';
import styled from 'styled-components';
import { coalesce } from '../helpers/coalesce';
import { isQuestion } from '../helpers/questions';

const AnswerOption = styled.label`
  width: 100%;
  border: ${props => (props.active ? '1px solid #ccc' : '1px solid #eee')};
  padding: 16px 16px 16px 36px !important;
  color: '#666';
  background-color: ${props => (props.active ? '#eee' : 'white')};
  margin-bottom: 8px;
`;

const Weight = styled.input`
  width: 90px;
  float: left;
`;

const Description = styled.span`
  padding-top: 5px;
  padding-left: 5px;
  margin-right: 15px;
  display: inline-block;
  float: left;
`;

const Height = styled.input`
  width: 70px;
  float: left;
`;

const RequiredText = styled.div`
  padding-left: 10px;
  font-weight: 300;
  color: #777;
`;

function Summary({ element, number, responseElement, showlogic }) {
  if (!element) {
    return <div>Loading Question...</div>;
  }
  if (!responseElement) {
    return <div>Loading Response...</div>;
  }

  let answers = '';

  if (isQuestion(element)) {
    answers = element.get('answers').map((answer, answerIndex) => {
      if (element.get('type') === 'text') {
        return (
          <div key={answer.get('id')}>
            <textarea
              key={answer.get('id')}
              className="form-control"
              rows="3"
              value={coalesce(
                responseElement.getIn(['answers', answerIndex, 'text']),
                ''
              )}
              readOnly
            />
          </div>
        );
      } else if (element.get('type') === 'weight') {
        return (
          <div key={answer.get('id')}>
            <Weight
              type="number"
              inputmode="numeric"
              key={answer.get('id')}
              className="form-control"
              value={coalesce(
                responseElement.getIn(['answers', answerIndex, 'pounds']),
                0
              )}
              readOnly
            />
            <Description>Pounds</Description>
          </div>
        );
      } else if (element.get('type') === 'date') {
        return (
          <div key={answer.get('id')}>
            <input
              type="date"
              className="form-control"
              value={coalesce(
                responseElement.getIn(['answers', answerIndex, 'date']),
                ''
              )}
              readOnly
            />
          </div>
        );
      } else if (element.get('type') === 'number') {
        return (
          <div key={answer.get('id')}>
            <input
              type="number"
              className="form-control"
              value={coalesce(
                responseElement.getIn(['answers', answerIndex, 'number']),
                ''
              )}
              readOnly
            />
          </div>
        );
      } else if (element.get('type') === 'height') {
        return (
          <div key={answer.get('id')}>
            <Height
              type="number"
              className="form-control"
              value={coalesce(
                responseElement.getIn(['answers', answerIndex, 'feet']),
                ''
              )}
              readOnly
            />
            <Description> Feet</Description>
            <Height
              type="number"
              className="form-control"
              value={coalesce(
                responseElement.getIn(['answers', answerIndex, 'inches']),
                ''
              )}
              readOnly
            />
            <Description> Inches</Description>
          </div>
        );
      }

      const selected =
        responseElement
          .get('answers')
          .filter(chosenAnswer => chosenAnswer.get('id') === answer.get('id'))
          .size > 0;

      return (
        <div className={element.get('type')} key={answer.get('id')}>
          <AnswerOption active={selected}>
            {element.get('type') !== 'text' &&
              <input
                style={{ marginRight: 8 }}
                name={`${responseElement.get('id')}-${answer.get('id')}`}
                type={element.get('type')}
                checked={selected}
                readOnly
              />}
            {' '}
            {answer.get('text')}{' '}
            {answer.get('goTo') &&
              showlogic === true &&
              <small className="text-muted">
                Go to: {answer.getIn(['goTo', 'title'])}
              </small>}{' '}
            {answer.get('concepts') &&
              !!answer.get('concepts').count() &&
              showlogic &&
              <span className="text-muted">
                {answer.get('concepts') &&
                  !!answer.get('concepts').count() &&
                  <small className="text-muted text-success">
                    (
                    {answer
                      .get('concepts')
                      .map(concept => concept.get('label'))
                      .join(', ')}
                    )
                  </small>}
              </span>}
            <img src={answer.get('image')} alt="" className="img-responsive" />
            {selected &&
              answer.get('followUp') &&
              <div style={{ marginTop: 8 }}>
                <strong>
                  {answer.getIn(['followUp', 'question'])}
                </strong>
                <textarea
                  className="form-control"
                  rows="3"
                  autoFocus
                  value={responseElement.getIn([
                    'answers',
                    answerIndex,
                    'followUp',
                    'text'
                  ])}
                  readOnly
                />
              </div>}
          </AnswerOption>
        </div>
      );
    });
  } else {
    answers = 'Unknown type';
  }

  return (
    <div style={{ marginBottom: 15 }}>
      <div className="media">
        <div className="pull-left">
          <strong>
            {number}.
          </strong>
        </div>
        <div className="media-body" style={{ paddingLeft: 10 }}>
          <p style={{ color: '#333', fontSize: 16, marginBottom: 6 }}>
            <strong>
              {element.get('question').split('\n').map((item, key) => (
                <span key={key}>
                  {item}
                  <br />
                </span>
              ))}
            </strong>
          </p>
          {element.get('required') &&
            <RequiredText>
              <small>Required</small>
            </RequiredText>}
          {element.get('image') &&
            <div
              style={{
                border: '1px solid #eee',
                padding: '5px',
                marginBottom: '8px'
              }}
            >
              <img
                src={element.get('image')}
                alt=""
                className="img-responsive"
              />
            </div>}
          <p className="text-muted">
            {element.get('type') === 'radio' && <span>Select One</span>}
            {element.get('type') === 'checkbox' && <span>Select Any</span>}
          </p>
          {answers}
        </div>
      </div>
    </div>
  );
}

export default Summary;
