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

const Weight = styled.input`
  width: 90px;
  float: left;
`;

const Description = styled.span`
  padding-top: 5px;
  padding-left: 5px;
  margin-right: 15px;
  display:inline-block;
  float: left;
`;

const Height = styled.input`
  width: 70px;
  float: left;
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
      const blah = responseElement.update('answers', currentAnswers =>
        currentAnswers.filter(currentAnswer =>
          currentAnswer.get('id') !== answer.get('id')
        )
      );
      return onAnswer(blah);
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
    if (element.get('type') === 'weight') {
      const newResponseElement = responseElement.set('answers', fromJS([{
        id: answer.get('id'),
        pounds: target.value !== '' ? parseInt(target.value, 10) : ''
      }]));
      return onAnswer(newResponseElement);
    }
    if (element.get('type') === 'date') {
      const newResponseElement = responseElement.set('answers', fromJS([{
        id: answer.get('id'),
        date: target.value
      }]));
      return onAnswer(newResponseElement);
    }
    if (element.get('type') === 'number') {
      const newResponseElement = responseElement.set('answers', fromJS([{
        id: answer.get('id'),
        number: target.value !== '' ? parseInt(target.value, 10) : ''
      }]));
      return onAnswer(newResponseElement);
    }
    return null;
  };

  const handleAnswerHeight = (e, answer, unit) => {
    const target = e.target; 
    if (unit === 'feet') {
      const newResponseElement = responseElement.set('answers', fromJS([{
        id: answer.get('id'),
        feet: target.value !== '' ? parseInt(target.value, 10) : '',
        inches: responseElement.getIn(['answers', 0, 'inches'])
      }]));
      return onAnswer(newResponseElement);
    }
    if (unit === 'inches') {
      const newResponseElement = responseElement.set('answers', fromJS([{
        id: answer.get('id'),
        inches: target.value !== '' ? parseInt(target.value, 10) : '',
        feet: responseElement.getIn(['answers', 0, 'feet'])
      }]));
      return onAnswer(newResponseElement);
    }
    return null;
  };

  const isQuestion = myElement => myElement.get('type') === 'checkbox' || myElement.get('type') === 'radio' || myElement.get('type') === 'text' || myElement.get('type') === 'weight' || myElement.get('type') === 'date' || myElement.get('type') === 'number' || myElement.get('type') === 'height';

  let answers = '';

  if (isQuestion(element)) {
    answers = element.get('answers').map((answer, answerIndex) => {
      if (element.get('type') === 'text') {
        return (<div key={answer.get('id')}>
          <textarea
            key={answer.get('id')}
            className="form-control"
            rows="3"
            value={coalesce(responseElement.getIn(['answers', answerIndex, 'text']), '')}
            onChange={e => handleAnswer(e, answer)}
          />
        </div>);
      } else if (element.get('type') === 'weight') {
        return (<div key={answer.get('id')}>
          <Weight
            type="number"
            inputmode="numeric"
            key={answer.get('id')}
            className="form-control"
            value={coalesce(responseElement.getIn(['answers', answerIndex, 'pounds']), 0)}
            onChange={e => handleAnswer(e, answer)}
          /><Description>Pounds</Description>
        </div>);
      } else if (element.get('type') === 'date') {
        return (<div key={answer.get('id')}>
          <input
            type="date"
            className="form-control"
            value={coalesce(responseElement.getIn(['answers', answerIndex, 'date']), '')}
            onChange={e => handleAnswer(e, answer)}
          />
        </div>);
      } else if (element.get('type') === 'number') {
        return (<div key={answer.get('id')}>
          <input
            type="number"
            className="form-control"
            value={coalesce(responseElement.getIn(['answers', answerIndex, 'number']), '')}
            onChange={e => handleAnswer(e, answer)}
          />
        </div>);
      } else if (element.get('type') === 'height') {
        return (<div key={answer.get('id')}>
          <Height
            type="number"
            className="form-control"
            value={coalesce(responseElement.getIn(['answers', answerIndex, 'feet']), '')}
            onChange={e => handleAnswerHeight(e, answer, 'feet')}
          /><Description> Feet</Description>
          <Height
            type="number"
            className="form-control"
            value={coalesce(responseElement.getIn(['answers', answerIndex, 'inches']), '')}
            onChange={e => handleAnswerHeight(e, answer, 'inches')}
          /><Description> Inches</Description>
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
