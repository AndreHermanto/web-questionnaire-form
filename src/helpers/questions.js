import { Map } from 'immutable';
import * as types from '../constants/QuestionTypes';

export const convertJsonLogicToText = value => {
  if (typeof value === 'object') {
    const key = Object.keys(value)[0];
    if (key === 'var') {
      return `a ${value[key]} value`;
    }
    const label = {
      '>': 'greater than',
      '<': 'less than',
      '==': 'equal',
      '!==': 'does not equal',
      and: 'and,',
      or: 'or'
    };
    return value[key].map(convertJsonLogicToText).join(` ${label[key]} `);
  }
  return value;
};

export const isQuestion = (question = Map()) =>
  question.get('type') &&
  Object.keys(types)
    .map(key => types[key])
    .indexOf(question.get('type')) >= 0;
