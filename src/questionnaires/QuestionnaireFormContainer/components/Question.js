import React from 'react';
import styled from 'styled-components';
import { fromJS } from 'immutable';
import { coalesce } from '../coalesce';

const AnswerOption = styled.label`
  width: 100%;
  border: ${props => props.active ? '1px solid #96C65E' : '1px solid #eee'};
  padding: 16px 16px 16px 36px !important;
  color: ${props => props.active ? '#7bb13d' : '#666'};
  background-color: ${props => props.active ? '#F0F7E7' : 'white'};
  margin-bottom: 8px;
`;

export default function Question({
  element,
  number,
  responseElement,
  onAnswer
}) {
  const handleAnswer = (e, answer) => {
    const target = e.target;
    if (element.get('type') === 'checkbox') {
      if (target.checked) {
        return onAnswer(responseElement.update('answers', currentAnswers =>
          currentAnswers.push(fromJS({ id: answer.get('id') })))
        );
      }
      return onAnswer(responseElement.update('answers', currentAnswers =>
        currentAnswers.filter(currentAnswer =>
          currentAnswer !== answer.get('id')
        )
      ));
    }
    if (element.get('type') === 'radio') {
      return onAnswer(responseElement.set('answers', fromJS([{ id: answer.get('id') }])));
    }
    if (element.get('type') === 'text') {
      const newResponseElement = responseElement.set('answers', fromJS([{
        id: answer.get('id'),
        text: target.value
      }]));
      return onAnswer(newResponseElement);
    }
    return null;
  };

  const isQuestion = myElement => myElement.get('type') === 'checkbox' || myElement.get('type') === 'radio' || myElement.get('type') === 'text';

  let answers = '';

  if (isQuestion(element)) {
    answers = element.get('answers').map((answer, answerIndex) => {
      if (element.get('type') === 'text') {
        return (<div>
          <textarea
            key={answer.get('id')}
            className="form-control"
            rows="3"
            value={coalesce(responseElement.getIn(['answers', answerIndex, 'text']), '')}
            onChange={e => handleAnswer(e, answer)}
          />
        </div>);
      }

      const selected = responseElement.get('answers').filter(chosenAnswer => chosenAnswer.get('id') === answer.get('id')).size > 0;

      return (<div className={element.get('type')} key={answer.get('id')}>
        <AnswerOption active={selected}>
          {element.get('type') !== 'text' &&
            (<input
              style={{ marginRight: 8 }}
              name={element.get('id')}
              type={element.get('type')}
              checked={selected}
              onChange={e => handleAnswer(e, answer)}
            />)
          }
          {' '}
          {answer.get('text')} {answer.get('goTo') && <small className="text-muted">Go to: {answer.getIn(['goTo', 'title'])}</small>}
          {' '}
          {answer.get('concepts') && !!answer.get('concepts').count() &&
          <span className="text-muted">({answer.get('concepts').map(concept => <small key={concept.get('id')} className="text-success">{concept.get('label')}</small>)})</span>
          }
          <img src={answer.get('image')} alt="" className="img-responsive" />

          {selected && answer.get('followUp') &&
            <div style={{ marginTop: 8 }}>
              <strong>{answer.getIn(['followUp', 'question'])}</strong>
              <textarea
                className="form-control"
                rows="3"
                autoFocus
                value={responseElement.getIn(['answers', answerIndex, 'followUp', 'text'])}
                onChange={e => onAnswer(responseElement.setIn(['answers', answerIndex, 'followUp', 'text'], e.target.value).toJSON())}
              />
            </div>
          }
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
          <strong>{element.get('question').split('\n').map((item, key) => <span key={key}>{item}<br /></span>)}</strong>
        </p>
        {element.get('image') && 
        <div style={{border: '1px solid #eee', padding: '5px', marginBottom: '8px'}}>
          <img src={element.get('image')} alt="" className="img-responsive"/>
        </div>}
        <p className="text-muted">
          {element.get('type') === 'radio' && <span>Select One</span>}
          {element.get('type') === 'checkbox' && <span>Select Any</span>}
        </p>
        {answers}
      </div>
    </div>
  </div>);
}
