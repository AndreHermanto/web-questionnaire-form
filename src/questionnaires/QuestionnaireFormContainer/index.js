import React, {Component} from 'react';
import {fromJS} from 'immutable';
import genomeConnect from './version';
import QuestionPreview from './QuestionPreview';

const userId = 'd0a264b2-f0dd-4660-b3b0-4d44d4b4bf03';
const questionnaireId = '57f35e83-8ab2-43d5-8bb3-eb74f2262629';
const versionId = '82d7d0ce-1885-4cb6-b27c-a9d06beed802';
const completed = false;

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
    this.createResponse = this.createResponse.bind(this);
    this.updateResponse = this.updateResponse.bind(this);
    this.handleQuestionAnswered = this.handleQuestionAnswered.bind(this);
  }

  componentDidMount() {
    this.createResponse();

    return fetch(`${process.env.REACT_APP_BASE_URL}/questionnaires/${this.props.params.questionnaireId}`).then(response => response.json()).then(json => json.data).then(questionnaire => {
      this.setState({questionnaire});
    }).catch(console.error);
  }

  updateResponse() {
    return fetch(`${process.env.REACT_APP_BASE_URL}/responses/${this.state.response.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state.response)
    })
    .then(response => response.json())
    .then(json => json.data)
    .then(response => {
      this.setState({
        response: response
      });
    })
    .catch(console.error);
  }

  createResponse() {
    const response = {
      userId: userId,
      questionnaireId: questionnaireId,
      questionnaireVersionId: versionId,
      completed: completed,
      answeredQuestions: []
    };
    return fetch(`${process.env.REACT_APP_BASE_URL}/responses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(response)
    })
    .then(response => response.json())
    .then(json => json.data)
    .then(response => {
      this.setState({
        response: response
      });
    })
    .catch(console.error);
  }

  handleQuestionAnswered() {
    this.updateResponse();
  }

  render() {
    return (
      <div className="container">
        <h4>Questionnaire Form</h4>
        {this.state.version.get('body').count()}
        {this.state.version.get('body').map((question, index) =>
          <QuestionPreview
            key={question.get('id')}
            number={index + 1}
            question={question}
            onAnswer={this.handleQuestionAnswered} />
        )}
      </div>
    );
  }
}

export default QuestionnaireForm;
