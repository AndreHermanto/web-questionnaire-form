import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { ProgressBar } from 'react-bootstrap';
import styled from 'styled-components';

const propTypes = {
  sections: PropTypes.oneOfType([
    PropTypes.instanceOf(Immutable.List).isRequired,
    PropTypes.array
  ])
  // version: PropTypes.instanceOf(Immutable.Map).isRequired,
  // onAnsweredQuestions: PropTypes.func.isRequired,
  // onNextPage: PropTypes.func.isRequired,
  // onPreviousPage: PropTypes.func.isRequired,
  // showBackButton: PropTypes.bool.isRequired,
  // showNextButton: PropTypes.bool.isRequired
};

/*
sections: {
  heading: 'asdfasdf',
  percentComplete: 65
}
*/

const defaultProps = {};

const circleRadius = 10;
function statusColor(percentComplete) {
  if (percentComplete === 0) {
    return '#E0E0E0';
  }
  if (percentComplete < 100) {
    return '#1298FF';
  }
  if (percentComplete === 100) {
    return '#5DC46C';
  }
  return 'black';
}
const SectionTitle = styled.div`
  text-transform: uppercase;
  color: black;
  font-weight: 600;
  overflow: auto;
  zoom: 1;
`;
const SectionStatus = styled.div`
  border-left: 5px solid ${props => statusColor(props.percentComplete)};
  padding-left: 16px;
  color: #aaa;
  margin-left: ${circleRadius - 2.5}px;
  margin-top: 6px;
  margin-bottom: 5px;
`;
const StatusCircle = styled.div`
  width: ${circleRadius * 2}px;
  height: ${circleRadius * 2}px;
  border: 4px solid ${props => statusColor(props.percentComplete)};
  background-color: ${props => (props.percentComplete === 0 ? 'white' : statusColor(props.percentComplete))};
  border-radius: ${circleRadius}px;
  position: relative;
  margin-right: 5px;
  float: left;
`;

function StepIndicator(props) {
  return (
    <div>
      <ul className="list-unstyled">
        {props.sections.map((section, i) => (
          <li key={i}>
            <StatusCircle percentComplete={section.percentComplete} />
            <SectionTitle>
              {section.heading}
            </SectionTitle>
            <SectionStatus percentComplete={section.percentComplete}>
              {section.percentComplete !== 100 &&
                <ProgressBar bsStyle="primary" now={section.percentComplete} />}
              {section.percentComplete === 100 && <div>Complete</div>}
            </SectionStatus>
          </li>
        ))}
        <li>
          <SectionTitle>
            <StatusCircle percentComplete={0} /> Summary
          </SectionTitle>
        </li>
      </ul>
    </div>
  );
}

StepIndicator.propTypes = propTypes;
StepIndicator.defaultProps = defaultProps;

export default StepIndicator;
