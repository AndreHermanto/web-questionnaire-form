import React from 'react';
import NavigationBar from './NavigationBar';
import Notifications from 'react-notify-toast';
import Routes from '../Routes';
export default function(props) {
  return (
    <div>
      <NavigationBar />
      <Notifications />
      <Routes />
    </div>
  );
}
