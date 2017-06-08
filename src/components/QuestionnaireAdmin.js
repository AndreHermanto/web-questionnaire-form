import React from 'react';
import { Link } from 'react-router';

export default function QuestionnaireAdmin(props) {
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
        {props.isLoading &&
          <p>Loading questionnaires...</p>
        }
        {props.isError &&
          <p>Error loading quesitonnaires.</p>
        }
        {(props.items && props.items.length === 0) &&
          <p className="text-muted">No questionnaires</p>
        }
        {props.items && props.items.map(questionnaire =>
          (<li key={questionnaire.get('id')}>
            <Link to={`/users/admin/questionnaires/${questionnaire.get('id')}?resume=${props.resume}&showlogic=true`}>{questionnaire.get('currentTitle')}</Link>
          </li>)
        )}
      </ul>
    </div>
  );
}
