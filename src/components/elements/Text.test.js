import React from 'react';
import { mount } from 'enzyme';
import Text from './Text';

test('Text Question renders a multiline line input', () => {
  // Render a text area when single line is false
  const props = {
    responseElement: {},
    answers: [{ id: '1', text: '' }],
    responseElementAnswers: [],
    element: {
      singleLine: false
    }
  };
  const checkbox = mount(<Text {...props} />);
  expect(checkbox.find('textarea').length).toEqual(1);
  expect(checkbox.find('input[type="text"]').length).toEqual(0);
});

test('Text Question renders a single line input', () => {
  // Render a text area when single line is false
  const props = {
    responseElement: {},
    answers: [{ id: '1', text: '' }],
    responseElementAnswers: [],
    element: {
      singleLine: true
    }
  };
  const checkbox = mount(<Text {...props} />);
  expect(checkbox.find('textarea').length).toEqual(0);
  expect(checkbox.find('input[type="text"]').length).toEqual(1);
});
