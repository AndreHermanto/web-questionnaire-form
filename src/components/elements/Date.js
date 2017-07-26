import React, { Component } from 'react';
import DatePicker from './DatePicker';
import get from 'lodash.get';
class Date extends Component {
  render() {
    const {
      responseElement,
      answers,
      setAnswerValue,
      responseElementAnswers
    } = this.props;
    return (
      <div>
        <DatePicker
          disabled={responseElement.preferNotToAnswer}
          date={get(responseElementAnswers, `${answers[0].id}.date`, null)}
          dateSelected={date => setAnswerValue(answers[0].id, 'date', date)}
        />
      </div>
    );
  }
}

export default Date;
