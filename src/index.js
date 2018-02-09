/* eslint-disable import/first */
// add polyfills
require('core-js/fn/object/entries');
// end of polyfills
import React from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk';
import 'bootstrap/dist/css/bootstrap.css';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import Immutable from 'immutable';
import installDevTools from 'immutable-devtools';
import jsonLogic from 'json-logic-js';
import App from './App';
import reducer from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import 'semantic-ui-css/semantic.min.css';
import './index.css';
// logger
// extra stuff for logging immutanle

// redux
const middleware = [];
middleware.push(thunk);

// logging (only in development)
if (process.env.NODE_ENV === 'development') {
  const { createLogger } = require('redux-logger');
  const logger = createLogger();
  middleware.push(logger);
  // install immutable dev tools
  installDevTools(Immutable);
}

// create patient portal store
const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(...middleware)) // add logging in as middleware
);

// add regex to json logic
jsonLogic.add_operation('regex', (value, regex) => {
  const patt = new RegExp(regex, 'g');
  const results = value.match(patt);
  if (!results || !results.length) {
    return false;
  }
  if (results[0] !== value) {
    return false;
  }
  return true;
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
