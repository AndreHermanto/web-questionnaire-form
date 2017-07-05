import React, { Component } from 'react';
import PropTypes from 'prop-types';

class StartEndText extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    fontSize: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    isItalic: PropTypes.bool.isRequired,
    isBold: PropTypes.bool.isRequired
  };
  render() {
    const { text, fontSize, color, isItalic, isBold } = this.props;
    return (
      <div>
        {text.split(/\r?\n/).map((line, i) => {
          return (
            <p
              key={i}
              style={{
                margin: 0,
                maxWidth: 'none',
                fontSize: `${fontSize}px`,
                color: `${color}`,
                fontStyle: `${isItalic ? 'italic' : 'none'}`,
                fontWeight: `${isBold ? 'bold' : 'none'}`
              }}
            >
              {line}
            </p>
          );
        })}
      </div>
    );
  }
}

export default StartEndText;
