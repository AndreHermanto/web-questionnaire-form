import React from 'react';
import { Link } from 'react-router';

export default function QuestionnaireAdmin(props) {
  return (
    <div className="container">
      <h4>Questionnaire Admin</h4>
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
          (<li key={questionnaire.id}>
            <Link to={`/users/3/questionnaires/${questionnaire.get('id')}/start/0?showlogic=true`}>{questionnaire.get('currentTitle')}</Link>
          </li>)
        )}
      </ul>
    </div>
  );
}
