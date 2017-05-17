import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { getQuestionnaires } from '../../actions';

//redux dispatch handler
let questionnaireHandler = function(dispatch) 
{
  let handleGetQuestionnaires = function(data) 
  {
    dispatch(getQuestionnaires(data));
  };

  return { handleGetQuestionnaires };
}

class QuestionnaireAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionnaires: []
    };
    this.handler = questionnaireHandler(this.props.dispatch);
    this.displayQuestionnaires = this.displayQuestionnaires.bind(this);
  }
  componentWillMount() {
    return fetch(`${process.env.REACT_APP_BASE_URL}/questionnaires`)
      .then(response => response.json())
      .then(json => json.data)
      .then((questionnaires) => {
        this.handler.handleGetQuestionnaires(questionnaires);
      })
      .catch(console.error);
  }
  displayQuestionnaires() {
    if(this.props.questionnaires.length > 0) {
      return this.props.questionnaires.map(questionnaire =>
        <li key={questionnaire.id}><Link to={`/users/3/questionnaires/${questionnaire.id}/pages/0`}>{questionnaire.currentTitle}</Link></li>
      )
    }
  }
  render() {
    let questionnaires = this.displayQuestionnaires();
    return (
      <div className="container">
        <h4>Questionnaire Admin</h4>
        <ul>
          {questionnaires}
        </ul>
      </div>
    );
  }
}

export default connect()(QuestionnaireAdmin);
