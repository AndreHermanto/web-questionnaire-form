import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './index';

it('Routes', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Routes />, div);
});
