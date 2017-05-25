import { fromJS } from 'immutable';
import * as types from '../constants/ActionTypes';

const initialState = {
  items: fromJS({}),
  isError: false,
  isLoading: false
};

export const getCurrentVersion = (state) => {
  return state.items.first() || null;
}

export const getById = (state, id) => {
  if (!getCurrentVersion(state)) {
    return null;
  }
  return getCurrentVersion(state).get('body').find(element => element.get('id') === id);
}

const versions = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_VERSION': {
      const version = fromJS(action.version);
      return {
        ...state,
        items: state.items.set(version.get('id'), version)
      };
    }
    case types.FETCH_VERSION_SUCCESS: {
      const version = fromJS(action.payload.version);
      return {
        ...state,
        items: state.items.set(version.get('id'), version)
      }
    }
    default:
      return state;
  }
};

export default versions;
