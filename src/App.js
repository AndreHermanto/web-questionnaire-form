import React, { Component } from 'react';
import './App.css';
import NavigationBar from './components/NavigationBar';
import Routes from './components/Routes';

class App extends Component {
  render() {
    return (
      <div>
        <NavigationBar />
        <Routes />
      </div>
    );
  }
}
export default App;
