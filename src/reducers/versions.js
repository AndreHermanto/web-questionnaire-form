import { fromJS } from 'immutable';
import * as types from '../constants/ActionTypes';

const initialState = {
  items: fromJS({}),
  isError: false,
  isLoading: false,
  currentId: null
};

export const getCurrentVersion = (state) => {
  if (state.currentId) {
    return state.items.get(state.currentId);
  }
  // TODO: remove this, should always use current id
  return state.items.size ? state.items.first() : null;
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
        currentId: version.get('id'),
        items: state.items.set(version.get('id'), version)
      };
    }
    case types.FETCH_VERSION_REQUEST: {
      return {
        ...state,
        currentId: null
      };
    }
    case types.FETCH_VERSION_SUCCESS: {
      const version = fromJS(action.payload.version);
      return {
        ...state,
        currentId: version.get('id'),
        items: state.items.set(version.get('id'), version)
      }
    }
    default:
      return state;
  }
};

export default versions;
