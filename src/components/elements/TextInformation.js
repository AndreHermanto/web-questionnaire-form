import React, { Component } from 'react';
class TextInformation extends Component {
  render() {
    const { element } = this.props;
    return <div>{element.text}</div>;
  }
}

export default TextInformation;
