import React, {
  Component
} from 'react';
import {
  ProgressBar
} from 'react-bootstrap';
import {
  Link
} from 'react-router';
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
        // load the current version
        return fetch(`${process.env.REACT_APP_BASE_URL}/questionnaires/${this.props.params.questionnaireId}/versions/${questionnaire.currentVersionId}`);
      })
      .then(response => response.json())
      .then((json) => {
        const realVersion = json.data;
        realVersion.body = JSON.parse(realVersion.body);

        if (!realVersion.body.length) {
          return;
        }
        this.setState({
          version: fromJS(realVersion)
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
    let percentComplete;
    if (this.state.response) {
      percentComplete = (this.state.response.answeredQuestions.length / this.state.version.get('body').filter(question => question.get('type') !== 'section').count()) * 100;
    } else {
      percentComplete = 0;
    }

    return (
      <div className="container">
        <h1 style={{ marginBottom: 32 }}>{this.state.version.get('title')}</h1>
        <div className="row">
          <div className="col-md-9">
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
          <div className="col-md-3">
            <div style={{ padding: 16, backgroundColor: 'white', position: 'fixed', width: '200px' }}>
              {this.state.version.get('title')}
              <p className="text-muted">
                Answered: { this.state.response && this.state.response.answeredQuestions.length }
                {' '}
                of
                {' '}
                { this.state.version.get('body').filter(question => question.get('type') !== 'section').count() }
              </p>
              <ProgressBar now={percentComplete} />
            </div>
          </div>
        </div>
        {this.state.response &&
        <Link
          to="/submitted"
          disabled={this.state.version.get('body').filter(question => question.get('type') !== 'section').count() !== this.state.response.answeredQuestions.length}
          className="btn btn-success btn-lg"
        >
          Submit Questionnaire
        </Link>}
      </div>
    );
  }
}

export default QuestionnaireForm;
