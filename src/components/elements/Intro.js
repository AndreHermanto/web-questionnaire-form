import React, { Component } from 'react';
import Markdown from 'react-markdown';

class Intro extends Component {
  render() {
    const { element } = this.props;
    return (
      <div>
        <Markdown source={element.text} escapeHtml={true} skipHtml={true} />
        {element.image &&
          <img
            src={element.image}
            alt="introduction"
            className="img-responsive"
          />}
      </div>
    );
  }
}

export default Intro;
