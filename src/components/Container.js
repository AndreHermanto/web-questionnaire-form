import React from 'react';
import NavigationBar from './NavigationBar';
import Notifications from 'react-notify-toast';

export default function(props) {
  return (
    <div>
      <NavigationBar />
      <Notifications />
      {props.children}
    </div>
  );
}
