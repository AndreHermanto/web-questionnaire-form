import React, { Component } from 'react';
import { Link } from 'react-router';
import pageMaker from '../QuestionnaireFormContainer/pageMaker';

class QuestionnaireAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionnaires: []
    };

    const pages = pageMaker([{
      id: 2,
      type: 'section',
      title: 'Genetic Testing'
    }, {
      id: 1,
      type: 'radio',
      question: 'Are you registering for yourself, your child, or another individual? (1)',
      answers: [
        {
          id: 1,
          text: 'Self',
          type: 'radio',
          goTo: 'Hormones / Endocrine'
        }
      ]
    }, {
      id: 3,
      type: 'radio',
      question: 'Have you had genetic testing? (2)',
      description: 'Examples: chromosome microarray (CMA), single gene sequencing test, gene panel test, whole exome sequencing (WES), whole genome sequencing (WGS). (2)',
      answers: [
        {
          id: 4,
          text: 'Yes',
          type: 'radio'
        }
      ]
    }, {
      id: 4,
      type: 'radio',
      question: 'Are you registering for yourself, your child, or another individual? (1)',
      answers: [
        {
          id: 1,
          text: 'Self',
          type: 'radio',
          goTo: 'Hormones / Endocrine'
        }
      ]
    }]);
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
          {this.state.questionnaires.map(questionnaire =>
            <li key={questionnaire.id}><Link to={`/users/3/questionnaires/${questionnaire.id}`}>{questionnaire.currentTitle}</Link></li>
          )}
        </ul>
      </div>
    );
  }
}

export default QuestionnaireAdmin;
