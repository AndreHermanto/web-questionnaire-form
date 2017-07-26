import React, { Component } from 'react';
class Intro extends Component {
  render() {
    const { element } = this.props;
    return (
      <div>
        {element.text}
      </div>
    );
  }
}

export default Intro;
