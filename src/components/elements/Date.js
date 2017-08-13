import React, { Component } from 'react';
import get from 'lodash.get';
class Date extends Component {
  render() {
    const { answers, setAnswerValue, responseElementAnswers } = this.props;
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
                value={get(responseElementAnswers, `${answers[0].id}.day`, '')}
                onChange={e =>
                  setAnswerValue(answers[0].id, 'day', e.target.value)}
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
                value={get(responseElementAnswers, `${answers[0].id}.year`, '')}
                onChange={e =>
                  setAnswerValue(answers[0].id, 'year', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Date;
