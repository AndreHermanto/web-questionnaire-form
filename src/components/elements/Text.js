import React, { Component } from 'react';
import get from 'lodash.get';
import Textarea from 'react-textarea-autosize';
import jsonLogic from 'json-logic-js';

class Text extends Component {
  renderValidation = (answers, text) => {
    // is it valid?
    const validationLogic = get(answers, '0.validationLogic.text', false);
    if (!validationLogic) {
      return null;
    }
    const isValid = jsonLogic.apply(validationLogic, {
      text
    });
    if (isValid) {
      return null;
    }
    if (!text || !text.length) {
      return null;
    }
    return (
      <div className="text-danger" style={{ marginTop: 8 }}>
        Please make sure your answer is valid.
      </div>
    );
  };
  render() {
    const {
      responseElement,
      answers,
      setAnswerValue,
      responseElementAnswers,
      element
    } = this.props;
    const text = get(responseElementAnswers, `${answers[0].id}.text`, '');

    const inputProps = {
      type: 'text',
      className: 'form-control',
      value: text,
      onChange: e => setAnswerValue(answers[0].id, 'text', e.target.value)
    };
    if (element.singleLine) {
      return (
        <div>
          <input {...inputProps} />
          {!responseElement.preferNotToAnswer &&
            this.renderValidation(answers, text)}
        </div>
      );
    }
    //
    return (
      <div>
        <Textarea
          {...inputProps}
          style={{
            resize: 'vertical',
            boxShadow: 'none',
            padding: 15,
            minHeight: 100
          }}
        />
        {!responseElement.preferNotToAnswer &&
          this.renderValidation(answers, text)}
      </div>
    );
  }
}

export default Text;
