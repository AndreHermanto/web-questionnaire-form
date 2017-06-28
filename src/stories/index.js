import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Button, Welcome } from '@storybook/react/demo';
import 'bootstrap/dist/css/bootstrap.css';

import TextInformation from '../components/TextInformation';
import NavigationBar from '../components/NavigationBar';
import '../index.css';

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('Button', module)
  .add('with text', () => <Button onClick={action('clicked')}>Click Me</Button>)
  .add('with some bold text', () => <Button onClick={action('clicked')}><strong>hello</strong></Button>);

const text = `Thank you for taking part in this Sanford Imagenetics Research study evaluating how information that you provide about your health and behaviors might help with diagnosis of genetic disease and your overall health care. This questionnaire includes questions not only about different health issues that you may have, but also about things that you may have been exposed to and your lifestyle choices. This will help us have a more complete picture of your health and may lead to better diagnostics and risk predication in the future.
If at any time you need to stop and take a break, you can do so and return later to finish the rest of the survey. You have the option to skip questions that you feel uncomfortable asking. You can exit the survey at any time and return later to finish it, however your answers will not be saved for a page of the survey until you advance to the next page on the survey. If you would like to ask a question before finishing this survey, please call the study coordinator at XXXX. Study personnel will attempt to respond to your message by the next business day.`;

storiesOf('TextInformation', module)
  .add('with text', () => <TextInformation text={text} />)

storiesOf('NavigationBar', module)
  .add('White', () => <NavigationBar />)
