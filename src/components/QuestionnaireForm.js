import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import Page from './Page';
import StepIndicator from './StepIndicator';

const propTypes = {
  sections: PropTypes.oneOfType([
    PropTypes.instanceOf(Immutable.List).isRequired,
    PropTypes.array
  ]),
  responseElements: PropTypes.instanceOf(Immutable.List).isRequired,
  version: PropTypes.instanceOf(Immutable.Map).isRequired,
  onAnsweredQuestions: PropTypes.func.isRequired,
  onNextPage: PropTypes.func.isRequired,
  onPreviousPage: PropTypes.func.isRequired,
  showBackButton: PropTypes.bool.isRequired,
  showNextButton: PropTypes.bool.isRequired,
  showlogic: PropTypes.bool.isRequired
};

const defaultProps = {};

function QuestionnaireForm(props) {
  const { sections, version, responseElements, showlogic } = props;
  return (
    <div className="container">
      <h1 style={{ marginBottom: 32 }}>
        {version.get('title')}
      </h1>
      <div className="row">
        <div className="col-sm-3">
          <div style={{ backgroundColor: 'white', padding: 16 }}>
            <StepIndicator sections={sections} />
          </div>
        </div>
        <div className="col-md-9">
          <Page
            responseElements={responseElements}
            version={version}
            onAnsweredQuestions={props.onAnsweredQuestions}
            onNextPage={props.onNextPage}
            onPreviousPage={props.onPreviousPage}
            showBackButton={props.showBackButton}
            showNextButton={props.showNextButton}
            showlogic={showlogic}
          />
        </div>
      </div>
    </div>
  );
}

QuestionnaireForm.propTypes = propTypes;
QuestionnaireForm.defaultProps = defaultProps;

export default QuestionnaireForm;
