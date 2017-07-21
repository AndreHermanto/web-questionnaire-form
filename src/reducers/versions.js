import { combineReducers } from 'redux-immutable';
import { fromJS, List } from 'immutable';
import * as types from '../constants/ActionTypes';
import { dedup } from '../helpers';

const byId = (state = fromJS({}), action) => {
  switch (action.type) {
    case types.FETCH_VERSION_SUCCESS:
      return state.merge(fromJS(action.payload.entities.versions));
    default:
      return state;
  }
};

const allIds = (state = List(), action) => {
  switch (action.type) {
    case types.FETCH_VERSION_SUCCESS:
      return dedup(state.concat([action.payload.result]));
    default:
      return state;
  }
};

const elements = combineReducers({
  byId,
  allIds
});

export default elements;

export const getAllElements = state => {
  return state.get('allIds').map(id => state.get('byId').get(id));
};
export const getById = (state, id) => {
  return state.get('byId').get(id);
};

// import { fromJS } from 'immutable';
// import * as types from '../constants/ActionTypes';
//
// const initialState = {
//   items: fromJS({}),
//   isError: false,
//   isLoading: false,
//   currentId: null
// };
//
export const getCurrentVersion = state => {
  // TODO: remove this, should always use current id
  return state.get('byId').first();
};
// //
// export const getById = (state, id) => {
//   if (!getCurrentVersion(state)) {
//     return null;
//   }
//   return getCurrentVersion(state)
//     .get('body')
//     .find(elementId => elementId === id);
// };

export const getEndPage = state => {
  const version = getCurrentVersion(state);
  if (!version) {
    return null;
  }
  return version.get('body').find(element => element.get('type') === 'end');
};
//
// const versions = (state = initialState, action) => {
//   switch (action.type) {
//     case 'SET_VERSION': {
//       const version = fromJS(action.version);
//       return {
//         ...state,
//         currentId: version.get('id'),
//         items: state.items.set(version.get('id'), version)
//       };
//     }
//     case types.FETCH_VERSION_REQUEST: {
//       return {
//         ...state,
//         currentId: null
//       };
//     }
//     case types.FETCH_VERSION_SUCCESS: {
//       // return state.merge(fromJS(action.payload.entities.questionnaires));
//       const myVersion = fromJS(
//         action.payload.entities.versions[action.payload.result]
//       );
//       return {
//         ...state,
//         currentId: myVersion.get('id'),
//         items: state.items.set(myVersion.get('id'), myVersion)
//       };
//     }
//     default:
//       return state;
//   }
// };
//
// export default versions;
//
export const getVersionById = (state, id) => {
  return state.get('byId').get(id);
};
