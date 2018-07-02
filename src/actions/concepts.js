import * as api from '../api/concepts';
import * as schema from './schema';
import * as types from '../constants/ConceptTypes';
import { normalize } from 'normalizr';

export function fetchConceptsRequest() {
  return {
    type: types.FETCH_CONCEPTS_REQUEST
  };
}

export const fetchConceptsSuccess = concepts => ({
  type: types.FETCH_CONCEPTS_SUCCESS,
  payload: normalize(concepts, schema.arrayOfConcepts)
});

export const fetchConceptsFailure = ex => {
  return {
    type: types.FETCH_CONCEPTS_FAILURE,
    ex
  };
};

export const fetchConcepts = (prefix, datasources) => dispatch => {
  dispatch(fetchConceptsRequest());
  return api
    .getConcepts(prefix, datasources)
    .then(res => dispatch(fetchConceptsSuccess(res)))
    .catch(ex => dispatch(fetchConceptsFailure(ex)));
};
