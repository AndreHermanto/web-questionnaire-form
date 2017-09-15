import React, { Component } from 'react';
import get from 'lodash.get';
import moment from 'moment';

class Date extends Component {
  render() {
    const { answers, setAnswerValue, responseElementAnswers } = this.props;
    const preventTypingMinus = e => {
      if (e.keyCode === 189) {
        e.preventDefault();
      }
    };
    const dayValue = get(responseElementAnswers, `${answers[0].id}.day`, '');
    const yearValue = get(responseElementAnswers, `${answers[0].id}.year`, '');
    const monthValue = get(
      responseElementAnswers,
      `${answers[0].id}.month`,
      ''
    );
    const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return (
      <div>
        <div className="row">
          <div className="col-sm-4">
            <div className="form-group">
              <label>Month</label>
              <select
                className="form-control"
                value={get(
                  responseElementAnswers,
                  `${answers[0].id}.month`,
                  ''
                )}
                onChange={e =>
                  setAnswerValue(answers[0].id, 'month', e.target.value)}
                disabled={this.props.disabled}
              >
                <option disabled={true} />
                <option value="01">January</option>
                <option value="02">February</option>
                <option value="03">March</option>
                <option value="04">April</option>
                <option value="05">May</option>
                <option value="06">June</option>
                <option value="07">July</option>
                <option value="08">August</option>
                <option value="09">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="form-group">
              <label>Day e.g. 01</label>
              <input
                disabled={this.props.disabled}
                type="number"
                className="form-control"
                placeholder="DD"
                value={dayValue}
                onChange={e =>
                  setAnswerValue(
                    answers[0].id,
                    'day',
                    e.target.value.slice(0, 2)
                  )}
                onKeyDown={preventTypingMinus}
              />
            </div>
          </div>
          <div className="col-sm-4">
            <div className="form-group">
              <label>Year e.g. 1984</label>
              <input
                disabled={this.props.disabled}
                type="number"
                className="form-control"
                placeholder="YYYY"
                value={yearValue}
                onChange={e =>
                  setAnswerValue(
                    answers[0].id,
                    'year',
                    e.target.value.slice(0, 4)
                  )}
                onKeyDown={preventTypingMinus}
              />
            </div>
          </div>
        </div>
        {!!dayValue.length &&
          (dayValue > monthLength[monthValue - 1] || dayValue < 1) &&
          <div className="text-danger">
            Invalid Day: Day must be between 1 and {monthLength[monthValue - 1]}{' '}
            for that month
          </div>}
        {!!yearValue.length &&
          (yearValue < 1900 || yearValue > moment().year()) &&
          <div className="text-danger">
            Invalid Year: Year must be between 1900 and {moment().year()}
          </div>}
      </div>
    );
  }
}

export default Date;
