import React from 'react';
import PropTypes from 'prop-types';
import { Helpers } from 'react-scroll';

const propTypes = {
  text: PropTypes.string.isRequired
};

function TextInformation(props) {
  return (
    <div
      style={{ marginBottom: 24, backgroundColor: 'white', border: '1px solid #eee', padding: 32 }}
    >
      {props.text.split('\n').map(item => <span key={item}>{item}<br /></span>)}
    </div>
  );
}
TextInformation.propTypes = propTypes;
export default Helpers.Element(TextInformation);
