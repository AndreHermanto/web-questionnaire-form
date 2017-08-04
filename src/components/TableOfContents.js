import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SectionHeading from './elements/SectionHeading';

class TableOfContents extends Component {
  static propTypes: {
    element: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
    this.renderElement = this.renderElement.bind(this);
  }
  renderElement() {
    const { element } = this.props;
    switch (element.type) {
      case 'section':
        return <SectionHeading {...this.props} />;
      default:
        return null;
    }
  }
  render() {
    return (
      <div>
        {this.renderElement()}
      </div>
    );
  }
}

export default TableOfContents;
