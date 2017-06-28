import React from 'react';
import NavigationBar from './NavigationBar';

export default function(props) {
  return (
    <div>
      <NavigationBar />
      {props.children}
    </div>
  );
}
