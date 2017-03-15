import React from 'react';
import _ from 'lodash';

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
    }
    onAnswer(newQuestionResponse);
  };

  let answers = '';
  if (question.get('type') === 'section') {
    return <h3 style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 16 }}>{question.get('title')}</h3>;
  }

  if (question.get('type') === 'checkbox' || question.get('type') === 'radio' || question.get('type') === 'text') {
    answers = question.get('answers').map(answer =>
      <div className={question.get('type')} key={answer.get('id')}>
        <label>
          {question.get('type') !== 'text' &&
          <input
            name={question.get('id')}
            type={question.get('type')}
            onChange={e => handleAnswer(e, answer)}
          />
          }
          {question.get('type') === 'text' &&
          <textarea
            className="form-control"
            rows="3"
            onChange={e => handleAnswer(e, answer)}
          />
          }
          {' '}
          {answer.get('text')} {answer.get('goTo') && <small className="text-muted">Go to: {answer.get('goTo')}</small>}
          {' '}
          {answer.get('concepts') && !!answer.get('concepts').count() &&
          <span className="text-muted">({answer.get('concepts').map(concept => <small key={concept.get('id')} className="text-success">{concept.get('label')}</small>)})</span>
          }
        </label>
      </div>
    );
  } else {
    answers = 'Unknown type';
  }

  return (<div>
    <p><strong>{number}. {question.get('question')}</strong></p>
    {answers}
  </div>);
}
