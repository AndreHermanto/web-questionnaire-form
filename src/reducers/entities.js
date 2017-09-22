import { combineReducers } from 'redux-immutable';

import versions from './versions';
import elements from './elements';
import responseElements from './responseElements';
import responseElementAnswers from './responseElementAnswers';
import responses from './responses';
import questionnaires from './questionnaires';
import answers from './answers';
import releases from './releases';

const entities = combineReducers({
  releases,
  questionnaires,
  versions, // a version of a questionnaire
  answers, // answers to questions
  elements, // questions
  responseElementAnswers, // responses to questions
  responseElements, // responses to questions
  responses // responses to whole version,
});

export default entities;
