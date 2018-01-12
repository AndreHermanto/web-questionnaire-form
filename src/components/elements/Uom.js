import React, { Component } from 'react';
import get from 'lodash.get';
class Uom extends Component {
  render() {
    const { answers, setAnswerValue, responseElementAnswers } = this.props;
    return (
      <div>
        <div className="input-group" style={{ marginBottom: 10 }}>
          <input
            type="number"
            className="form-control"
            value={get(responseElementAnswers, `${answers[0].id}.value1`, '')}
            onChange={e =>
              setAnswerValue(answers[0].id, 'value1', e.target.value)
            }
          />
          <span className="input-group-addon" id="basic-addon2">
            {answers[0].value1.uom.label}
          </span>
        </div>
      </div>
    );
  }
}

export default Uom;
