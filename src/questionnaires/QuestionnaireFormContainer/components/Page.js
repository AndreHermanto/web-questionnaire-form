import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import Question from './Question';
import Heading from './Heading';

const propTypes = {
  responseElements: PropTypes.instanceOf(Immutable.List).isRequired,
  version: PropTypes.instanceOf(Immutable.Map).isRequired,
  onAnsweredQuestions: PropTypes.func.isRequired,
  onNextPage: PropTypes.func.isRequired,
  onPreviousPage: PropTypes.func.isRequired,
  showBackButton: PropTypes.bool.isRequired,
  showNextButton: PropTypes.bool.isRequired
};

const defaultProps = {
};

function Page(props) {
  const { responseElements, version } = props;
  return (<div>
    <div style={{ marginBottom: 16, overflow: 'auto' }}>
      {props.showBackButton && <button className="btn btn-default btn-lg" onClick={props.onPreviousPage}>Back</button>}
      {' '}
      {props.showNextButton && <button className="btn btn-success btn-lg pull-right" onClick={props.onNextPage}>Next</button>}
    </div>
    {responseElements.map((responseElement, index) => {
      // find the element in the version
      const element = version.get('body').filter(myElement =>
        myElement.get('id') === responseElement.get('elementId')
      ).get(0);

      // text information
      if (element.get('type') === 'textinformation') {
        return (<div key={responseElement.get('id')} style={{ marginBottom: 24, backgroundColor: 'white', border: '1px solid #eee', padding: 32 }}>
          {element.get('text').split('\n').map(item => <span key={item}>{item}<br /></span>)}
        </div>);
      }

      // section heading
      if (element.get('type') === 'section') {
        return <Heading key={responseElement.get('id')} text={element.get('title')} size={element.get('size')} />;
      }

      // questions
      return (<Question
        key={responseElement.get('id')}
        number={index + 1}
        element={element}
        responseElement={responseElement}
        onAnswer={props.onAnsweredQuestions}
      />);
    })}
    <div style={{ marginBottom: 16, overflow: 'auto' }}>
      {props.showBackButton && <button className="btn btn-default btn-lg" onClick={props.onPreviousPage}>Back</button>}
      {' '}
      {props.showNextButton && <button className="btn btn-success btn-lg pull-right" onClick={props.onNextPage}>Next</button>}
    </div>
  </div>);
}

Page.propTypes = propTypes;
Page.defaultProps = defaultProps;

export default Page;
