import React from 'react';
import PropTypes from 'prop-types';
import { Helpers } from 'react-scroll';
import toJS from './toJS';

const propTypes = {
  text: PropTypes.string.isRequired
};

const defaultProps = {
};

function Heading(props) {
  return (<h2 style={{ marginBottom: 32, marginTop: 40 }} className="text-capitalize">
    {props.text}
  </h2>);
}

Heading.propTypes = propTypes;
Heading.defaultProps = defaultProps;

export default Helpers.Element(toJS(Heading));
