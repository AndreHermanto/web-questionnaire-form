import React from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import coalesce from './coalesce';
import image from './image.png';

const AnswerOption = styled.label`
  width: 100%;
  border: ${props => props.active ? '1px solid #96C65E' : '1px solid #eee'};
  padding: 16px 16px 16px 36px !important;
  color: ${props => props.active ? '#7bb13d' : '#666'};
  background-color: ${props => props.active ? '#F0F7E7' : 'white'};
  margin-bottom: 8px;
`;

export default function QuestionPreview({
  question,
  number,
  questionResponse,
  onAnswer }) {
  const handleAnswer = (e, answer) => {
    const target = e.target;
    const newQuestionResponse = Object.assign({}, questionResponse);
    if (question.get('type') === 'checkbox') {
      if (target.checked) {
        newQuestionResponse.answers.push({
          id: answer.get('id')
        });
      } else {
        newQuestionResponse.answers = _.reject(newQuestionResponse.answers, { id: answer.get('id') });
      }
    }
    if (question.get('type') === 'radio') {
      newQuestionResponse.answers = [{
        id: answer.get('id')
      }];
    }
    if (question.get('type') === 'text') {
      newQuestionResponse.answers = [{
        id: answer.get('id'),
        text: target.value
      }];
      console.log(newQuestionResponse);
    }
    onAnswer(newQuestionResponse);
  };

  let answers = '';
  if (question.get('type') === 'section') {
    return <h2 style={{ marginBottom: 32, marginTop: 40 }}>{question.get('title')}</h2>;
  }

  if (question.get('type') === 'checkbox' || question.get('type') === 'radio' || question.get('type') === 'text') {
    answers = question.get('answers').map((answer) => {
      if (question.get('type') === 'text') {
        console.log('text', questionResponse.answers);
        const existingAnswer = _.find(questionResponse.answers, { id: answer.get('id') });
        let value;
        console.log('existing answer', existingAnswer);
        if (existingAnswer) {
          value = existingAnswer.text;
        } else {
          value = '';
        }
        return (<textarea
          key={answer.get('id')}
          className="form-control"
          rows="3"
          value={value}
          onChange={e => handleAnswer(e, answer)}
        />);
      }
      return (<div className={question.get('type')} key={answer.get('id')}>
        <AnswerOption active={!!_.find(questionResponse.answers, { id: answer.get('id') })}>
          {question.get('type') !== 'text' &&
          (<input
            style={{ marginRight: 8 }}
            name={question.get('id')}
            type={question.get('type')}
            checked={!!_.find(questionResponse.answers, { id: answer.get('id') })}
            onChange={e => handleAnswer(e, answer)}
          />)
          }
          {' '}
          {answer.get('text')} {answer.get('goTo') && <small className="text-muted">Go to: {answer.get('goTo')}</small>}
          {' '}
          {answer.get('concepts') && !!answer.get('concepts').count() &&
          <span className="text-muted">({answer.get('concepts').map(concept => <small key={concept.get('id')} className="text-success">{concept.get('label')}</small>)})</span>
          }
          <img src={answer.get('image')} alt="" className="img-responsive" />
        </AnswerOption>
      </div>);
    });
  } else {
    answers = 'Unknown type';
  }

  return (<div style={{ marginBottom: 24, backgroundColor: 'white', border: '1px solid #eee', padding: 32 }}>
    <div className="media">
      <div className="pull-left"><strong>{number}.</strong></div>
      <div className="media-body" style={{ paddingLeft: 16 }}>
        <p style={{ color: '#333', fontSize: 16, marginBottom: 16 }}>
          <strong>{question.get('question').split('\n').map((item, key) => <span key={key}>{item}<br /></span>)}</strong>
        </p>
        <p className="text-muted">
          {question.get('type') === 'radio' && <span>Select One</span>}
          {question.get('type') === 'checkbox' && <span>Select Any</span>}
        </p>
        {answers}
      </div>
    </div>
  </div>);
}
