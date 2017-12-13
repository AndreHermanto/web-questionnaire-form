import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const propTypes = {
  questionnaires: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired
};

const defaultProps = {};

function QuestionnaireAdmin(props) {
  let spinner;
  if (props.isLoading) {
    spinner = spinner = <span className="loading" />;
  }
  return (
    <div className="container">
      {spinner}
      <h4>Questionnaire Admin</h4>
      <ul>
        {props.questionnaires.map(questionnaire => (
          <li key={questionnaire.id}>
            <Link
              to={`/users/admin/questionnaires/${questionnaire.id}?resume=false&showlogic=true`}
            >
              {questionnaire.currentTitle}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

QuestionnaireAdmin.propTypes = propTypes;
QuestionnaireAdmin.defaultProps = defaultProps;

export default QuestionnaireAdmin;
