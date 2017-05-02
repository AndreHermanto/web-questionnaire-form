import React, {
  Component
} from 'react';
import {
  ProgressBar,
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock
} from 'react-bootstrap';
import {
  hashHistory
} from 'react-router';
import cuid from 'cuid';
import { fromJS } from 'immutable';
import _ from 'lodash';
import QuestionPreview from './QuestionPreview';
import pageMaker from './pageMaker';
import BackButton from './components/BackButton';

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
  static markPageAsViewedInResponse(page, response) {
    const questionIds = page.get('questions').map(question => question.get('id')).toJSON();

    return Object.assign({}, response, {
      answeredQuestions: response.answeredQuestions.map((questionResponse) => {
        if (questionIds.indexOf(questionResponse.id) >= 0) {
          // its on this page
          // mark them as view
          return Object.assign({}, questionResponse, { viewed: true });
        }
        return questionResponse;
      })
    });
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
    this.goToPage = this.goToPage.bind(this);
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
        const pages = fromJS(pageMaker(version.get('body').toJSON()));
        if (this.state.response.answeredQuestions.length === 0) {
          // we need to add all the responses
          let response = this.state.response;
          // add all the questions
          response.answeredQuestions = version.get('body').filter(element => element.get('type') !== 'section').map(question => ({
            id: question.get('id'),
            viewed: false,
            answers: []
          })).toJSON();
          // mark the this page as viewed
          response = QuestionnaireForm.markPageAsViewedInResponse(pages.get(this.props.routeParams.page), response);
          this.setState(response);
          QuestionnaireForm.updateResponse(response);
        }
        this.setState({
          version,
          pages,
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
    const currentPage = parseInt(this.props.routeParams.page, 10);
    // get the last question on this page
    // it may have skip logic
    const lastQuestion = this.state.pages
      .get(currentPage)
      .get('questions').last();

    if (!lastQuestion) {
      console.error('Something is probably wrong here, we didnt find a last quesiton on the page we are on');
      nextPageIndex = currentPage + 1;
      this.goToPage(nextPageIndex);
      return;
    }

    // find the users responses for this last question
    const questionResponse = _.find(this.state.response.answeredQuestions, { id: lastQuestion.get('id') });

    if (!questionResponse) {
      // they didnt answer the last question, just go to next page
      // we have no idea if they should skip or not
      // so just go ahead
      this.goToPage(currentPage + 1);
      return;
    }

    // see if any of the answer responses did have skip logic
    const answersResponsesWithSkipLogic = lastQuestion.get('answers')
      .filter(answer => answer.get('goTo'))
      .filter(answer => _.find(
        questionResponse.answers,
        answerResponse => answerResponse.id === answer.get('id'))
      );

    if (answersResponsesWithSkipLogic.count()) {
      const firstAnswer = answersResponsesWithSkipLogic.get(0);
      const sectionIdToGoTo = firstAnswer.getIn(['goTo', 'id']);
      if (sectionIdToGoTo === 'End') {
        this.handeSubmitQuestionnaire();
        return;
        // its the end, submit it, and go home
      }
      // find the page to go to
      nextPageIndex = _.findIndex(this.state.pages.toJSON(), page =>
        page.sectionId === sectionIdToGoTo
      );

      if (nextPageIndex < currentPage) {
        // we are looping back
        // copy all the pages, between next and current, inclusive, and add them after current
        const setId = cuid();
        const duplicatePages = this.state.pages.slice(nextPageIndex, currentPage + 1)
          .map(page => page.update('questions', questions =>
            questions.map(question =>
              question
                .set('id', cuid())
                .set('setId', setId)
            )
          )
        );

        const beforePages = this.state.pages.slice(0, currentPage + 1);
        const afterPages = this.state.pages.slice(currentPage);
        this.setState({
          pages: beforePages.concat(duplicatePages).concat(afterPages)
        }, () => {
          this.goToPage(currentPage + 1);
        });
        return;
      }
    } else {
      nextPageIndex = currentPage + 1;
    }
    this.goToPage(nextPageIndex);
  }

  goToPage(pageIndex) {
    const response = QuestionnaireForm.markPageAsViewedInResponse(
      this.state.pages.get(pageIndex),
      this.state.response
    );
    this.setState({
      response
    });
    QuestionnaireForm.updateResponse(response);
    hashHistory.push(`/users/${this.props.routeParams.userId}/questionnaires/${this.props.routeParams.questionnaireId}/pages/${pageIndex}`);
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
    const page = this.state.pages.get(this.props.routeParams.page);
    return (<div>
      <h2>{page.get('heading')}</h2>
      {page.get('questions').map((element, index) => {
        if (element.get('type') === 'textinformation') {
          return (<div style={{ marginBottom: 24, backgroundColor: 'white', border: '1px solid #eee', padding: 32 }}>
            {element.get('text').split('\n').map((item, key) => <span key={key}>{item}<br/></span>)}
          </div>);
        }
        let questionResponse;
        if (this.state.response) {
          questionResponse = _.find(this.state.response.answeredQuestions, { id: element.get('id') }) || {
            id: element.get('id'),
            answers: []
          };
        } else {
          questionResponse = { id: element.get('id'), answers: [] };
        }

        return (<QuestionPreview
          key={element.get('id')}
          number={index + 1}
          element={element}
          questionResponse={questionResponse}
          onAnswer={this.handleQuestionAnswered}
        />);
      })}
      <BackButton
        answeredQuestions={this.state.response.answeredQuestions}
        pages={this.state.pages}
        currentPageIndex={parseInt(this.props.routeParams.page, 10)}
        {...this.props.routeParams}
      >
        Back
      </BackButton>
      {' '}
      {this.props.routeParams.page < this.state.pages.count() - 1 &&
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
    const percentComplete = ((this.props.routeParams.page) / this.state.pages.count()) * 100;

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
    const currentPage = this.state.pages.get(this.props.routeParams.page);
    if (!currentPage) {
      return <div>No current page.</div>;
    }
    return (
      <div className="container">
        <h1 style={{ marginBottom: 32 }}>{this.state.version.get('title')}</h1>
        <div className="row">
          <div className="col-sm-3">
            <div style={{ padding: 24, backgroundColor: 'white', border: '1px solid #eee' }}>
              <ProgressBar now={percentComplete} />
              <ul className="list-unstyled">
                {headings.map(heading => <li style={{ fontWeight: currentPage.get('heading2') ? '' : 'bold' }}>
                  {heading}
                  {heading === currentPage.get('heading') &&
                  <ul>
                    {currentPage.get('heading2') && <li style={{ fontWeight: currentPage.get('heading3') ? '' : 'bold' }}>{currentPage.get('heading2')}</li>}
                    {currentPage.get('heading3') && <li>{currentPage.get('heading3')}</li>}
                  </ul>}
                </li>)}
              </ul>
            </div>
          </div>
          <div className="col-md-9">
            {this.renderPage()}
            {this.state.response && parseInt(this.props.routeParams.page, 10) === this.state.pages.count() - 1 &&
            <button
              onClick={this.handeSubmitQuestionnaire}
              className="btn btn-success btn-lg"
            >
              Submit Questionnaire
            </button>}
          </div>
        </div>
      </div>
    );
  }
}

export default QuestionnaireForm;
