import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Button, Welcome } from '@storybook/react/demo';
import 'bootstrap/dist/css/bootstrap.css';

import TextInformation from '../components/TextInformation';

import NavigationBar from '../components/NavigationBar';
import MatrixQuestion from '../components/MatrixQuestion';
import DatePicker from '../components/DatePicker';
import '../index.css';

storiesOf('Welcome', module).add('to Storybook', () => (
  <Welcome showApp={linkTo('Button')} />
));

storiesOf('Button', module)
  .add('with text', () => <Button onClick={action('clicked')}>Click Me</Button>)
  .add('with some bold text', () => (
    <Button onClick={action('clicked')}>
      <strong>hello</strong>
    </Button>
  ));

const text = `Thank you for taking part in this Sanford Imagenetics Research study evaluating how information that you provide about your health and behaviors might help with diagnosis of genetic disease and your overall health care. This questionnaire includes questions not only about different health issues that you may have, but also about things that you may have been exposed to and your lifestyle choices. This will help us have a more complete picture of your health and may lead to better diagnostics and risk predication in the future.
If at any time you need to stop and take a break, you can do so and return later to finish the rest of the survey. You have the option to skip questions that you feel uncomfortable asking. You can exit the survey at any time and return later to finish it, however your answers will not be saved for a page of the survey until you advance to the next page on the survey. If you would like to ask a question before finishing this survey, please call the study coordinator at XXXX. Study personnel will attempt to respond to your message by the next business day.`;

storiesOf('TextInformation', module).add('with text', () => (
  <TextInformation text={text} />
));

storiesOf('NavigationBar', module).add('White', () => <NavigationBar />);

storiesOf('MatrixQuestion', module)
  .add('Radio', () => {
    const questions = [
      { id: 1, question: 'Coke' },
      { id: 2, question: 'Wine' },
      { id: 3, question: 'Beer' }
    ];
    const answers = [
      { id: 1, text: 'Weekly' },
      { id: 2, text: 'Monthly' },
      { id: 3, text: 'Yearly' },
      { id: 4, text: 'Never' }
    ];
    const type = 'radio';
    const active = {
      1: { 2: true },
      2: { 1: true }
    };
    return (
      <MatrixQuestion
        id={1}
        title="How often do you drink the following?"
        type={type}
        questions={questions}
        answers={answers}
        active={active}
        onAnswerClicked={action('matrix answer clicked')}
      />
    );
  })
  .add('Checkbox', () => {
    const questions = [
      { id: 1, question: 'Cancer' },
      { id: 2, question: 'Diabetes' },
      { id: 3, question: 'Heart Disease' }
    ];
    const answers = [
      { id: 1, text: 'Children' },
      { id: 2, text: 'Siblings' },
      { id: 3, text: 'Parents' },
      { id: 4, text: 'Grandparents' }
    ];
    const type = 'checkbox';
    const active = {
      1: { 2: true, 3: false, 4: true },
      2: { 1: true }
    };
    return (
      <MatrixQuestion
        id={1}
        title="Have any of these occured in your family?"
        type={type}
        questions={questions}
        answers={answers}
        active={active}
        onAnswerClicked={action('matrix answer clicked')}
      />
    );
  });

storiesOf('DatePicker', module)
  .add('without a full date', () => (
    <DatePicker dateSelected={action('date selected')} />
  ))
  .add('with a full date', () => (
    <DatePicker date={'1987-11-18'} dateSelected={action('date selected')} />
  ));
