import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { addQuestionnaires } from '../../actions';

class QuestionnaireAdminContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionnaires: []
    };
    this.displayQuestionnaires = this.displayQuestionnaires.bind(this);
  }

  componentWillMount() {
    return fetch(`${process.env.REACT_APP_BASE_URL}/questionnaires`)
      .then(response => response.json())
      .then(json => json.data)
      .then((questionnaires) => {
        this.props.dispatch(addQuestionnaires(questionnaires));
      })
      .catch(console.error);
  }

  displayQuestionnaires() {
    if (!this.props.questionnaires) {
      return <p>Loading questionnaires...</p>;
    }
    if (this.props.questionnaires.length === 0) {
      return <p className="text-muted">No questionnaires</p>;
    }
    return this.props.questionnaires.map(questionnaire =>
      <li key={questionnaire.id}><Link to={`/users/3/questionnaires/${questionnaire.id}/pages/0`}>{questionnaire.currentTitle}</Link></li>
    );
  }

  render() {
    const questionnaires = this.displayQuestionnaires();
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

function mapStateToProps(state) {
  return {
    questionnaires: state.questionnaires
  };
}

export default connect(mapStateToProps)(QuestionnaireAdminContainer);
