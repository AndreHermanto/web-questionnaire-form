import React from 'react';

export default function QuestionPreview({ question, number, onAnswer }) {
  let answers = '';
  if (question.get('type') === 'section') {
    return <h3 style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 16 }}>{question.get('title')}</h3>
  }

  if (question.get('type') === 'checkbox' || question.get('type') === 'radio' || question.get('type') === 'text') {
    answers = question.get('answers').map((answer, index) => {
      return <div className={question.get('type')} key={index}>
        <label>
          {question.get('type') !== 'text' &&
          <input
            name={question.get('id')}
            type={question.get('type')}
            onChange={onAnswer} />
          }
          {question.get('type') === 'text' &&
          <textarea className="form-control" rows="3"></textarea>
          }
          {' '}
          {answer.get('text')} {answer.get('goTo') && <small className="text-muted">Go to: {answer.get('goTo')}</small>}
          {' '}
          {answer.get('concepts') && !!answer.get('concepts').count() &&
          <span className="text-muted">({answer.get('concepts').map(concept => <small key={concept.get('id')} className="text-success">{concept.get('label')}</small>)})</span>
          }
        </label>
      </div>;
    });
  } else {
    answers = 'Unknown type';
  }

  return <div>
    <p><strong>{number}. {question.get('question')}</strong></p>
    {answers}
  </div>
}
