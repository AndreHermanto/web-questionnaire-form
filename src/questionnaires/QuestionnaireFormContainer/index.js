import React, { Component } from 'react';
import { fromJS } from 'immutable';
import cuid from 'cuid';
import _ from 'lodash';
import genomeConnect from './version';
import QuestionPreview from './QuestionPreview';

const userId = 'd0a264b2-f0dd-4660-b3b0-4d44d4b4bf03';
const questionnaireId = '57f35e83-8ab2-43d5-8bb3-eb74f2262629';
const versionId = '82d7d0ce-1885-4cb6-b27c-a9d06beed802';
const completed = false;

class QuestionnaireForm extends Component {
  constructor(props) {
    super(props);
    const version = fromJS(genomeConnect).update('body', (body) => {
      return body.map((item) => {
        if (!item.has('answers')) {
          return item;
        }
        return item.update('answers', answers =>
          answers.map(answer =>
            answer.set('id', cuid())
          )
        );
      });
    });

    this.state = {
      questionnaire: fromJS({
        id: 'eda1fd27-0303-4083-93aa-a01fe8536607',
        dateCreated: 'Thu Mar 09 2017 02:36:21 GMT+1000 (AEST)',
        lastUpdated: 'Thu Mar 09 2017 12:42:54 GMT+1000 (AEST)',
        status: 'molestias',
        currentTitle: 'Id voluptas cupiditate.',
        currentVersionId: '1615a7ad-6f52-4377-aac1-8129c20c9341',
        creator: 'delectus'
      }),
      version
    };
    this.createResponse = this.createResponse.bind(this);
    this.updateResponse = this.updateResponse.bind(this);
    this.handleQuestionAnswered = this.handleQuestionAnswered.bind(this);
  }

  componentDidMount() {
    this.createResponse();

    return fetch(`${process.env.REACT_APP_BASE_URL}/questionnaires/${this.props.params.questionnaireId}`)
      .then(response => response.json())
      .then(json => json.data)
      .then((questionnaire) => {
        this.setState({
          questionnaire
        });
      })
      .catch(console.error);
  }

  updateResponse(questionnaireResponse) {
    return fetch(`${process.env.REACT_APP_BASE_URL}/responses/${questionnaireResponse.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(questionnaireResponse)
    })
    .then(response => response.json())
    .then(json => json.data)
    .then((response) => {
      this.setState({
        response
      });
    })
    .catch(console.error);
  }

  createResponse() {
    const questionnaireResponse = {
      userId,
      questionnaireId,
      versionId,
      completed,
      answeredQuestions: []
    };
    return fetch(`${process.env.REACT_APP_BASE_URL}/responses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(questionnaireResponse)
    })
    .then(response => response.json())
    .then(json => json.data)
    .then((response) => {
      this.setState({
        response
      });
    })
    .catch(console.error);
  }

  handleQuestionAnswered(question) {
    const answeredQuestions = this.state.response.answeredQuestions;
    const response = this.state.response;
    const index = _.findIndex(answeredQuestions, { id: question.id });
    if (index >= 0) {
      answeredQuestions.splice(index, 1, question);
      response.answeredQuestions = answeredQuestions;
    } else {
      response.answeredQuestions.push(question);
    }

    // store the change
    this.setState({
      response
    });
    // send to server
    this.updateResponse(response);
  }

  render() {
    return (
      <div className="container">
        <h4>Questionnaire Form</h4>
        {this.state.version.get('body').count()}
        {this.state.version.get('body').map((question, index) => {
          let questionResponse;
          if (this.state.response) {
            questionResponse = _.find(this.state.response.answeredQuestions, { id: question.get('id') }) || {
              id: question.get('id'),
              answers: []
            };
          } else {
            questionResponse = { id: question.get('id'), answers: [] };
          }

          return (<QuestionPreview
            key={question.get('id')}
            number={index + 1}
            question={question}
            questionResponse={questionResponse}
            onAnswer={this.handleQuestionAnswered}
          />);
        })}
      </div>
    );
  }
}

export default QuestionnaireForm;
