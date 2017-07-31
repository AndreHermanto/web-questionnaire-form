import React, { Component } from 'react';
class Intro extends Component {
  render() {
    const { element } = this.props;
    return (
      <div>
        {element.text}
        <img
          src={element.image}
          alt="introduction"
          className="img-responsive"
        />
      </div>
    );
  }
}

export default Intro;
