import { Map } from 'immutable';
import * as types from '../constants/QuestionTypes';

export const isQuestion = (question = Map()) =>
  question.get('type') && Object.keys(types).map(key => types[key])
    .indexOf(question.get('type')) >= 0;
