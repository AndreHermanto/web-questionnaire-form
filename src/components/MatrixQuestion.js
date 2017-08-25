import React from 'react';
import PropTypes from 'prop-types';
import toJS from './toJS';
import AnswerOption from './AnswerOption';

const propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  questions: PropTypes.array.isRequired,
  type: PropTypes.oneOf(['radio', 'checkbox']).isRequired,
  answers: PropTypes.array.isRequired,
  /* example for active
      {
        3: { 2: true }
      }
      question 3, answer 2, is true
  */
  active: PropTypes.object.isRequired,
  onAnswerClicked: PropTypes.func.isRequired
};
const defaultProps = {};

function MatrixQuestion(props) {
  return (
    <div>
      {props.questions.map((question, questionIndex) => (
        <div key={question.id}>
          <div>
            <strong>
              {question.question}
            </strong>
          </div>
          <div>
            {props.answers.map(answer => {
              const active =
                props.active[question.id] &&
                props.active[question.id][answer.id];
              return (
                <div className={props.type} key={answer.id}>
                  <AnswerOption active={active}>
                    <input
                      name={`${props.id}-${question.id}-${answer.id}`}
                      type={props.type}
                      checked={active}
                      onChange={e =>
                        props.onAnswerClicked(
                          props.id,
                          question.id,
                          answer.id,
                          e.target.checked
                        )}
                    />
                    {answer.text}
                  </AnswerOption>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

MatrixQuestion.propTypes = propTypes;
MatrixQuestion.defaultProps = defaultProps;

export default toJS(MatrixQuestion);
