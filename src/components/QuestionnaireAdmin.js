import React from 'react';
import { Link } from 'react-router';
import cuid from 'cuid';

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
        {props.items && props.items.valueSeq().map(questionnaire =>
          (<li key={questionnaire.get('id')}>
            <Link to={`/users/${cuid()}/questionnaires/${questionnaire.get('id')}?showlogic=true&resume=${props.resume}`}>{questionnaire.get('currentTitle')}</Link>
          </li>)
        )}
      </ul>
    </div>
  );
}
