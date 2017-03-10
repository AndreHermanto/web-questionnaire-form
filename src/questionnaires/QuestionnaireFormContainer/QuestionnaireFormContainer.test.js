import React from 'react';
import ReactDOM from 'react-dom';
import QuestionnaireForm from './index';

it('QuestionnaireForm', () => {
  const div = document.createElement('div');
  ReactDOM.render(<QuestionnaireForm params={{questionnaireId: 1}} />, div);
});
