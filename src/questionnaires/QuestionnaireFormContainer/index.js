import React, {Component} from 'react';
import { fromJS } from 'immutable';
import genomeConnect from './version';
import QuestionPreview from './QuestionPreview';

class QuestionnaireForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionnaire: fromJS({
        "id": "eda1fd27-0303-4083-93aa-a01fe8536607",
        "dateCreated": "Thu Mar 09 2017 02:36:21 GMT+1000 (AEST)",
        "lastUpdated": "Thu Mar 09 2017 12:42:54 GMT+1000 (AEST)",
        "status": "molestias",
        "currentTitle": "Id voluptas cupiditate.",
        "currentVersionId": "1615a7ad-6f52-4377-aac1-8129c20c9341",
        "creator": "delectus"
      }),
      version: fromJS(genomeConnect)
    };
  }
  componentDidMount() {
    return fetch(`${process.env.REACT_APP_BASE_URL}/questionnaires/${this.props.params.questionnaireId}`).then(response => response.json()).then(json => json.data).then(questionnaire => {
      this.setState({questionnaire});
    }).catch(console.error);
  }
  render() {
    return (
      <div className="container">
          <h4>Questionnaire Form</h4>
          {this.state.version.get('body').count()}
          {this.state.version.get('body').map((question, index) => <QuestionPreview key={question.get('id')} number={index + 1} question={question} /> )}
      </div>
    );
  }
}

export default QuestionnaireForm;
