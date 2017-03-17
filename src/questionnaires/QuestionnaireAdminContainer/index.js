import React, { Component } from 'react';
import { Link } from 'react-router';

class QuestionnaireAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionnaires: []
    };
  }
  componentDidMount() {
    return fetch(`${process.env.REACT_APP_BASE_URL}/questionnaires`)
      .then(response => response.json())
      .then(json => json.data)
      .then((questionnaires) => {
        this.setState({
          questionnaires
        });
      })
      .catch(console.error);
  }
  render() {
    return (
      <div className="container">
        <h4>Questionnaire Admin</h4>
        <ul>
          {this.state.questionnaires.map(questionnaire => <li key={questionnaire.id}><Link to={`/users/1/questionnaires/${questionnaire.id}`}>{questionnaire.currentTitle}</Link></li>)}
        </ul>
      </div>
    );
  }
}

export default QuestionnaireAdmin;
