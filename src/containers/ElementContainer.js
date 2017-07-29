import React, { Component } from 'react';

import { connect } from 'react-redux';
import * as actions from '../actions';
// import { getAllQuestionnaires } from '../reducers';
// import QuestionnaireAdmin from '../components/QuestionnaireAdmin';
import toJS from '../components/toJS';
import * as selectors from '../reducers';
import NewElement from '../components/NewElement';
import Immutable from 'immutable';

class ElementContainer extends Component {
  static propTyes: {
    responseElementId: PropTypes.string.isRequired
  };
  render() {
    return <NewElement {...this.props} />;
  }
}
function mapStateToProps(state, ownProps) {
  // get response element
  const responseElement = selectors.getResponseElementById(
    state,
    ownProps.responseElementId
  );
  if (!responseElement) {
    return {};
  }
  // get element
  const element = selectors.getElementById(
    state,
    responseElement.get('elementId')
  );

  // get answer
  const answers = element.get('answers')
    ? element
        .get('answers')
        .map((answerId, index) => selectors.getAnswerById(state, answerId))
    : Immutable.List();

  const responseElementAnswers = responseElement
    .get('answers')
    .reduce(
      (acc, responseElementAnswerId) =>
        acc.set(
          responseElementAnswerId,
          selectors.getResponseElementAnswersById(
            state,
            responseElementAnswerId
          )
        ),
      Immutable.Map()
    );

  return {
    element,
    responseElement,
    answers,
    responseElementAnswers,
    questionNumber: selectors.getQuestionNumber(
      state,
      ownProps.responseElementId
    )
  };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  selectAnswer: answerId => {
    dispatch(actions.selectAnswer(ownProps.responseElementId, answerId));
  },
  toggleAnswer: answerId => {
    dispatch(actions.toggleAnswer(ownProps.responseElementId, answerId));
  },
  setAnswerValue: (answerId, valuePropertyName, value) => {
    dispatch(
      actions.setAnswerValue(
        ownProps.responseElementId,
        answerId,
        valuePropertyName,
        value
      )
    );
  },
  onPreferNotToAnswer: () => {
    dispatch(actions.markAsPreferNotToAnswer(ownProps.responseElementId));
  },
  onFollowUpChanged: (answerId, followUpText) => {
    dispatch(
      actions.setFollowUpResponse(
        ownProps.responseElementId,
        answerId,
        followUpText
      )
    );
  },
  dispatch
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
  //   , undefined, {
  //   areStatePropsEqual: (next, prev) => {
  //     console.log('areStatePropsEqual', next, prev);
  //     for (let key in next) {
  //       if (prev[key] === next[key]) {
  //         console.log('they are equal!', key);
  //       } else {
  //         console.log('they are not equal!', key, prev[key], next[key]);
  //       }
  //     }
  //     return next === prev;
  //   }
  // }
)(toJS(ElementContainer));
