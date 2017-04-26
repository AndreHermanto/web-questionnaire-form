import React from 'react';
import styled from 'styled-components';
import {
  ProgressBar
} from 'react-bootstrap';

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
  background-color: ${props => props.percentComplete === 0 ? 'white' : statusColor(props.percentComplete)};
  border-radius: ${circleRadius}px;
  position: relative;
  margin-right: 5px;
  float: left;
`;

export default function asdf({
  progress,
  sections
}) {
  return (<div>
    <ul className="list-unstyled">
      {sections.map(section => (<li>
        <StatusCircle percentComplete={section.percentComplete} />
        <SectionTitle>{section.heading}</SectionTitle>
        <SectionStatus percentComplete={section.percentComplete}>
          {section.percentComplete !== 100 &&
          <ProgressBar
            bsStyle="primary"
            now={section.percentComplete}
          />}
          {section.percentComplete ===  100 && <div>Complete</div>}
        </SectionStatus>
      </li>))}
      <li>
        <SectionTitle><StatusCircle  percentComplete={progress} /> Special Section</SectionTitle>
        <SectionStatus percentComplete={progress}>
          <ProgressBar
            bsStyle="primary"
            now={progress} />
        </SectionStatus>
      </li>
      <li>
        <SectionTitle><StatusCircle percentComplete={0}/> Summary</SectionTitle>
      </li>
    </ul>
  </div>);
}
