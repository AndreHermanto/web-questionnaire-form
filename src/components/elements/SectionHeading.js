import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SectionHeading extends Component {
  static propTypes: {
    element: PropTypes.object.isRequired
  };
  render() {
    const { title, size } = this.props.element;
    const CustomTag = `h${size}`;
    return (
      <div style={{ marginBottom: 24 }}>
        <CustomTag>
          {title}
        </CustomTag>
      </div>
    );
  }
}

export default SectionHeading;
