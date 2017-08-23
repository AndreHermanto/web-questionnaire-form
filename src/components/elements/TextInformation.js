import React, { Component } from 'react';
import Markdown from 'react-markdown';
class TextInformation extends Component {
  render() {
    const { element } = this.props;
    return <Markdown source={element.text} escapeHtml={true} skipHtml={true} />;
  }
}

export default TextInformation;
