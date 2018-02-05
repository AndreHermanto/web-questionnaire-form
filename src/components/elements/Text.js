import React, { Component } from 'react';
import get from 'lodash.get';
import Textarea from 'react-textarea-autosize';
import { Input } from 'semantic-ui-react';
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
      <div className="text-danger">
        Please make sure your answer conforms to the following:{' '}
        {JSON.stringify(validationLogic)}
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
      onChange: e => setAnswerValue(answers[0].id, 'text', e.target.value),
      style: {
        resize: 'vertical',
        boxShadow: 'none',
        padding: 15,
        minHeight: 100
      }
    };
    if (element.singleLine) {
      return <Input {...inputProps} />;
    }
    //
    return (
      <div>
        <Textarea {...inputProps} />
        {!responseElement.preferNotToAnswer &&
          this.renderValidation(answers, text)}
      </div>
    );
  }
}

export default Text;
