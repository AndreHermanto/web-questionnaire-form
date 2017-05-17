import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import App from './App';
import './index.css';

//redux
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import PatientPortalApp from './reducers/index.js';

//create patient portal store
let store = createStore(PatientPortalApp);

/*
* the code below would be useful for tracking our store state and action 
*/

store.subscribe((render)=>
{
  console.log("store changed", store.getState());
})

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

