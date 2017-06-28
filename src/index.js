import React from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk';
import { fromJS } from 'immutable';
import 'bootstrap/dist/css/bootstrap.css';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import App from './App';
import reducer from './reducers';
import './index.css';
import { getCurrentResponse } from './reducers';
import * as api from './api';
// logger
// extra stuff for logging immutanle

// redux
const middleware = [];
middleware.push(thunk);

// logging (only in development)
if (process.env.NODE_ENV === `development`) {
  const { createLogger } = require(`redux-logger`);
  const logger = createLogger({
    stateTransformer: state => {
      let newState = {};

      // https://github.com/evgenyrodionov/redux-logger/blob/a7fc6d71742867beb26422639b2d89e3d398a5d2/README.md#transform-immutable-without-combinereducers
      for (var i of Object.keys(state)) {
        // deal with logged immutable stuff
        newState[i] = fromJS(state[i]).toJS();
      }
      return newState;
    }
  });
  middleware.push(logger);
}

// create patient portal store
const store = createStore(
  reducer,
  applyMiddleware(...middleware) // add logging in as middleware
);

let currentValue;
function handleChange() {
  let previousValue = currentValue;
  currentValue = getCurrentResponse(store.getState());
  if (currentValue && previousValue !== currentValue) {
    api.updateResponse(currentValue.get('id'), currentValue);
  }
}
store.subscribe(handleChange);
// let unsubscribe =

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
