import React from 'react';
import { Link } from 'react-router';

export default function QuestionnaireAdmin(props) {
  return (
      <div className="container">
        <h4>Questionnaire Admin</h4>
        <ul>
          { !props.questionnaires &&
            <p>Loading questionnaires...</p>
          }
          { (props.questionnaires && props.questionnaires.length === 0) &&
            <p className="text-muted">No questionnaires</p>
          }
          { props.questionnaires && props.questionnaires.map(questionnaire =>
            <li key={questionnaire.id}><Link to={`/users/3/questionnaires/${questionnaire.id}/pages/0`}>{questionnaire.currentTitle}</Link></li>
          )
          }
        </ul>
      </div>
    );
}