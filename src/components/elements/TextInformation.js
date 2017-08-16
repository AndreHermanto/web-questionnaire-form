import React, { Component } from 'react';
class TextInformation extends Component {
  render() {
    const { element } = this.props;
    return (
      <div
        style={{
          fontWeight: `${element.textStyle.isBold ? 'bold' : 'normal'}`
        }}
      >
        {element.text}
      </div>
    );
  }
}

export default TextInformation;
