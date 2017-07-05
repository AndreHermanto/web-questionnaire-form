import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import Immutable from 'immutable';

const propTypes = {
  resume: PropTypes.bool.isRequired,
  handleChangeResume: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
  items: PropTypes.instanceOf(Immutable.Map).isRequired
};

const defaultProps = {};

function QuestionnaireAdmin(props) {
  return (
    <div className="container">
      <h4>Questionnaire Admin</h4>
      <form>
        <label>
          Resume:
          <input
            name="resume"
            type="checkbox"
            checked={props.resume}
            onChange={props.handleChangeResume}
          />
        </label>
      </form>
      <ul>
        {props.isLoading && <p>Loading questionnaires...</p>}
        {props.isError && <p>Error loading quesitonnaires.</p>}
        {props.items &&
          props.items.length === 0 &&
          <p className="text-muted">No questionnaires</p>}
        {props.items &&
          props.items.toSeq().map(questionnaire => (
            <li key={questionnaire.get('id')}>
              <Link
                to={`/users/admin/questionnaires/${questionnaire.get('id')}?resume=${props.resume}&showlogic=true`}
              >
                {questionnaire.get('currentTitle')}
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
