import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

const propTypes = {
  questionnaires: PropTypes.array.isRequired
};

const defaultProps = {};

function QuestionnaireAdmin(props) {
  return (
    <div className="container">
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
