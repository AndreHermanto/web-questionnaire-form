import React, {
  Component
} from 'react';
import {
  ProgressBar,
  PanelGroup,
  Panel,
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock
} from 'react-bootstrap';
import {
  hashHistory
} from 'react-router';
import { fromJS } from 'immutable';
import _ from 'lodash';
import QuestionPreview from './QuestionPreview';
import pageMaker from './pageMaker';

const completed = false;

class QuestionnaireForm extends Component {
  static updateResponse(questionnaireResponse) {
    return fetch(`${process.env.REACT_APP_BASE_URL}/responses/${questionnaireResponse.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(questionnaireResponse)
    })
    .catch(console.error);
  }

  static getResponse(questionnaireId, userId) {
    return fetch(`${process.env.REACT_APP_BASE_URL}/responses?questionnaireId=${questionnaireId}&userId=${userId}`)
    .catch(console.error);
  }

  constructor(props) {
    super(props);

    this.state = {
    };

    this.createResponse = this.createResponse.bind(this);
    this.debouncedUpdateResponse = _.debounce(QuestionnaireForm.updateResponse, 500);
    this.handleQuestionAnswered = this.handleQuestionAnswered.bind(this);
    this.handleNextPage = this.handleNextPage.bind(this);
    this.handeSubmitQuestionnaire = this.handeSubmitQuestionnaire.bind(this);
  }

  componentDidMount() {
    return fetch(`${process.env.REACT_APP_BASE_URL}/questionnaires/${this.props.params.questionnaireId}`)
      .then(response => response.json())
      .then(json => json.data)
      .then((questionnaire) => {
        // store the questionnaire
        this.setState({
          questionnaire
        });

        // check for existing responses
        return QuestionnaireForm
          .getResponse(this.props.params.questionnaireId, this.props.params.userId)
          .then(response => response.json())
          .then(json => json.data)
          .then((userResponses) => {
            if (userResponses.length > 1) {
              this.setState({
                response: userResponses[0]
              });
              console.error('There are more than one responses for this questionnaire, each questionnaire should only have one response', userResponses);
              return fetch(`${process.env.REACT_APP_BASE_URL}/questionnaires/${this.props.params.questionnaireId}/versions/${userResponses[0].versionId}`);
            }
            if (userResponses.length === 0) {
              // no response, make a new one
              // use the latest version
              return this.createResponse(questionnaire.currentVersionId)
              .then(response => response.json())
              .then(json => json.data)
              .then((userResponse) => {
                this.setState({
                  response: userResponse
                });
                return fetch(`${process.env.REACT_APP_BASE_URL}/questionnaires/${this.props.params.questionnaireId}/versions/${questionnaire.currentVersionId}`);
              });
            }
            if (userResponses.length === 1) {
              this.setState({
                response: userResponses[0]
              });
              // get the version, they ahve already started filling out
              return fetch(`${process.env.REACT_APP_BASE_URL}/questionnaires/${this.props.params.questionnaireId}/versions/${userResponses[0].versionId}`);
            }
            return false;
          });
      })
      .then(response => response.json())
      .then((json) => {
        const realVersion = json.data;
        realVersion.body = JSON.parse(realVersion.body);
        if (!realVersion.body.length) {
          return;
        }
        const version = fromJS(realVersion);
        this.setState({
          version,
          pages: fromJS(pageMaker(version.get('body').toJSON())),
          selectedPageIndex: 0
        });
      })
      .catch(console.error);
  }

  createResponse(versionId) {
    const questionnaireResponse = {
      userId: this.props.params.userId,
      questionnaireId: this.props.params.questionnaireId,
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
    this.debouncedUpdateResponse(response);
  }

  handleNextPage() {
    let nextPageIndex;
    // get the last question on this page
    // it may have skip logic
    const lastQuestion = this.state.pages
      .get(this.state.selectedPageIndex)
      .get('questions').last();

    if (!lastQuestion) {
      nextPageIndex = this.state.selectedPageIndex + 1;
      this.setState({
        selectedPageIndex: nextPageIndex
      });
      return;
    }

    // find the users responses for this last question
    const questionResponse = _.find(this.state.response.answeredQuestions, { id: lastQuestion.get('id') });

    // see if any of the answer responses did have skip logic
    const answersResponsesWithSkipLogic = lastQuestion.get('answers')
      .filter(answer => answer.get('goTo'))
      .filter(answer => _.find(
        questionResponse.answers,
        answerResponse => answerResponse.id === answer.get('id'))
      );

    if (answersResponsesWithSkipLogic.count()) {
      // find the page to go to
      nextPageIndex = _.findIndex(this.state.pages.toJSON(), page =>
        page.heading === answersResponsesWithSkipLogic.get(0).get('goTo')
      );
    } else {
      nextPageIndex = this.state.selectedPageIndex + 1;
    }
    this.setState({
      selectedPageIndex: nextPageIndex
    });
  }

  handeSubmitQuestionnaire() {
    const response = this.state.response;
    response.completed = true;
    this.setState({
      response
    });
    // send to server
    QuestionnaireForm.updateResponse(response);
    hashHistory.push('/submitted');
  }
  renderPage() {
    const page = this.state.pages.get(this.state.selectedPageIndex);
    return (<div>
      <h2>{ page.get('heading') }</h2>
      <h3>{ page.get('heading2') }</h3>
      <h4>{ page.get('heading3') }</h4>
      {page.get('questions').map((question, index) => {
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
      {this.state.selectedPageIndex < this.state.pages.count() - 1 &&
      <button
        className="btn btn-success btn-lg"
        onClick={this.handleNextPage}
      >
        Next
      </button>
      }
    </div>);
  }

  render() {
    if (!this.state.questionnaire || !this.state.version) {
      return <div className="container">Loading...</div>;
    }
    const percentComplete = ((this.state.selectedPageIndex) / this.state.pages.count()) * 100;

    function FieldGroup({ id, label, help, ...props }) {
      return (
        <FormGroup controlId={id}>
          <ControlLabel>{label}</ControlLabel>
          <FormControl {...props} />
          {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
      );
    }

    const headings = _.uniq(this.state.pages.map(page => page.get('heading')).toJSON());
    return (
      <div className="container">
        <h1 style={{ marginBottom: 32 }}>{this.state.version.get('title')}</h1>
        <div className="row">
          <div className="col-sm-1">
            {percentComplete}%
          </div>
          <div className="col-sm-11">
            <ProgressBar now={percentComplete} />
          </div>
        </div>
        <div>
          {headings.map(heading => <div>{heading}</div> )}
        </div>
        <div className="row">
          <div className="col-md-9">
            {this.renderPage()}
          </div>
        </div>
        {this.state.response && this.state.selectedPageIndex === this.state.pages.count() - 1 &&
        <button
          onClick={this.handeSubmitQuestionnaire}
          className="btn btn-success btn-lg"
        >
          Submit Questionnaire
        </button>}
      </div>
    );
  }
}

export default QuestionnaireForm;
