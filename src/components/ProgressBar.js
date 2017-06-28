import React from 'react';
import styled from 'styled-components';
import { Line } from 'rc-progress';
import PropTypes from 'prop-types';

const propTypes = {
  completed: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

const defaultProps = {
};

const Percentage = styled.h5`
  margin-left: 97%;
  font-weight: 600;
  color: #777;
  opacity: 0.8;
`;

function ProgressBar(props) {
  const { completed, total } = props;
    return (
      <div>
        <Line percent={Math.min(completed/total*100, 95)} strokeWidth="1" strokeColor="#337ab7" />
        <Percentage>{Math.round(Math.min(completed/total*100, 95))} %</Percentage>
      </div>
    );
}


ProgressBar.propTypes = propTypes;
ProgressBar.defaultProps = defaultProps;

export default ProgressBar;