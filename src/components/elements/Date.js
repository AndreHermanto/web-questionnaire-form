import React, { Component } from 'react';
import DatePicker from './DatePicker';
import get from 'lodash.get';
class Date extends Component {
  render() {
    const {
      responseElement,
      answers,
      setAnswerValue,
      responseElementAnswers,
      onPreferNotToAnswer
    } = this.props;
    return (
      <div>
        <DatePicker
          date={get(responseElementAnswers, `${answers[0].id}.date`, null)}
          dateSelected={date => {
            setAnswerValue(answers[0].id, 'date', date);
            if (responseElement.preferNotToAnswer) {
              onPreferNotToAnswer();
            }
          }}
        />
      </div>
    );
  }
}

export default Date;
