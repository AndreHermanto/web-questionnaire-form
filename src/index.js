import React from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk';
import 'bootstrap/dist/css/bootstrap.css';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';
import App from './App';
import reducer from './reducers';
import './index.css';

// redux
const middleware = [];
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger());
  middleware.push(thunk);
}

// create patient portal store
const store = createStore(
  reducer,
  applyMiddleware(...middleware) // add logging in as middleware
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
