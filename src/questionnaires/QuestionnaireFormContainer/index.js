import React, {
  Component
} from 'react';
import {
  hashHistory
} from 'react-router';
import cuid from 'cuid';
import { fromJS } from 'immutable';
import _ from 'lodash';
import Page from './components/Page';

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
  static markPageAsViewedInResponse(startIndex, endIndex, response) {
    return response.update('answeredQuestions', responseElements =>
      responseElements.map((responseElement, index) => {
        if (startIndex <= index && index <= endIndex) {
          return responseElement.set('viewed', true);
        }
        return responseElement;
      })
    );
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
    this.handlePreviousPage = this.handlePreviousPage.bind(this);
    this.handeSubmitQuestionnaire = this.handeSubmitQuestionnaire.bind(this);
    this.goToPage = this.goToPage.bind(this);
    this.getEndIndex = this.getEndIndex.bind(this);
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
                response: fromJS(userResponses[0])
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
                  response: fromJS(userResponse)
                });
                return fetch(`${process.env.REACT_APP_BASE_URL}/questionnaires/${this.props.params.questionnaireId}/versions/${questionnaire.currentVersionId}`);
              });
            }
            if (userResponses.length === 1) {
              this.setState({
                response: fromJS(userResponses[0])
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

        if (this.state.response.get('answeredQuestions').size === 0) {
          // we need to add all the responses
          const response = this.state.response.update('answeredQuestions', () =>
            version.get('body').map(element => fromJS({
              id: cuid(),
              elementId: element.get('id'),
              viewed: false,
              answers: []
            }))
          );
          QuestionnaireForm.updateResponse(response.toJSON());

          // const pages = pageMaker(response.get('answeredQuestions'), version.get('body'));

          // mark the this page as viewed
          this.setState({
            version,
            response
          }, () => {
            this.goToPage(parseInt(this.props.routeParams.startIndex, 10));
          });
        } else {
          this.setState({
            version
          });
        }
      })
      .catch(console.error);
  }

  getEndIndex(startIndex) {
    // calculate the end index
    return this.state.response.get('answeredQuestions').reduce((carry, responseElement, index) => {
      if (index < startIndex) {
        return carry;
      }
      if (carry) {
        return carry;
      }

      // we have reached the end, didnt find a stopping point
      // so just include this last element
      if (!carry && index === this.state.response.get('answeredQuestions').size - 1) {
        return index;
      }

      const element = this.state.version.get('body').filter(myElement =>
        myElement.get('id') === responseElement.get('elementId')
      ).get(0);

      if (element.get('type') === 'radio' || element.get('type') === 'text' || element.get('type') === 'checkbox') {
        // this question has skip logic, so, stop here
        if (element.get('answers').filter(answer => answer.get('goTo')).size) {
          // stop on this element
          return index;
        }

        // there is a next element
        const nextResponseElement = this.state.response.get('answeredQuestions').get(index + 1);
        const nextElement = this.state.version.get('body').filter(myElement =>
          myElement.get('id') === nextResponseElement.get('elementId')
        ).get(0);

        // if there are multiple headings in a row
        // only stop on the last one
        // so if the next one is a heading, we just keep going
        if (nextElement.get('type') === 'section') {
          return index;
        }
      }
      return carry;
    }, null);
  }

  getStartIndex(endIndex) {
    return this.state.response.get('answeredQuestions').reduceRight((carry, responseElement, index) => {
      if (index > endIndex) {
        return carry;
      }
      if (carry) {
        return carry;
      }

      // we have reached the end, didnt find a stopping point
      // so just include this last element
      if (!carry && index === 0) {
        return index;
      }

      const element = this.state.version.get('body').filter(myElement =>
        myElement.get('id') === responseElement.get('elementId')
      ).get(0);
      const previousResponseElement = this.state.response.get('answeredQuestions').get(index - 1);
      const previousElement = this.state.version.get('body').filter(myElement =>
        myElement.get('id') === previousResponseElement.get('elementId')
      ).get(0);

      // its a section, and the next element, is a question, so we stop
      if (
        element.get('type') === 'section' &&
        (previousElement.get('type') === 'radio' || previousElement.get('type') === 'text' || previousElement.get('type') === 'checkbox')
      ) {
        return index;
      }

      // the next element is a question with skip logic, so we stop
      if (
        (previousElement.get('type') === 'radio' || previousElement.get('type') === 'text' || previousElement.get('type') === 'checkbox') &&
        previousElement.get('answers').filter(answer => answer.get('goTo')).size
      ) {
        return index;
      }

      // keep going
      return carry;
    }, null);
  }

  createResponse(versionId) {
    const completed = false;
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

  handleQuestionAnswered(responseElement) {
    // replace the answer with the new answer
    const response = this.state.response.update('answeredQuestions', responseElements =>
      fromJS(responseElements.reduce((carry, myResponseElement) => {
        if (myResponseElement.get('id') === responseElement.get('id')) {
          return [...carry, responseElement];
        }
        return [...carry, myResponseElement];
      }, [])));

    // store the change
    this.setState({
      response
    });
    // send to server
    this.debouncedUpdateResponse(response.toJSON());
  }

  handleNextPage() {
    const currentEndIndex = this.props.routeParams.endIndex ?
      parseInt(this.props.routeParams.endIndex, 10) :
      this.getEndIndex(parseInt(this.props.routeParams.startIndex, 10));

    if (currentEndIndex === this.state.response.get('answeredQuestions').size - 1) {
      // its the end
      // submit it
      return this.handeSubmitQuestionnaire();
    }

    // where to next?
    const responseElement = this.state.response.getIn(['answeredQuestions', currentEndIndex]);

    if (responseElement.get('answers').size === 0) {
      // no answers!
      // just go to the next page
      return this.goToPage(currentEndIndex + 1);
    }

    // last question
    const element = this.state.version.get('body').filter(myElement => myElement.get('id') === responseElement.get('elementId')).first();
    // checking for skip logic
    const chosenAnswerIds = responseElement.get('answers').map(
      responseElementAnswer => responseElementAnswer.get('id')
    );
    const chosenAnswersWithSkipLogic = element.get('answers').filter(answer =>
      answer.get('goTo') && chosenAnswerIds.includes(answer.get('id'))
    );
    if (chosenAnswersWithSkipLogic.size) {
      // do some skip logic!
      const goTo = chosenAnswersWithSkipLogic.first().get('goTo');
      // skip to end of questionnaire
      if (goTo.get('id') === 'End') {
        return this.handeSubmitQuestionnaire();
      }
      // look for section id
      const newStartIndex = this.state.response.get('answeredQuestions').reduce((carry, myResponseElement, index) => {
        if (carry) {
          return carry;
        }
        if (index > currentEndIndex && myResponseElement.get('elementId') === goTo.get('id')) {
          return index;
        }
        return carry;
      }, null);
      if (newStartIndex) {
        return this.goToPage(newStartIndex);
      }

      // okay, this is complicated, so here goes
      const loopBackStartIndex = this.state.response.get('answeredQuestions').reduce((carry, myResponseElement, index) => {
        if (index < currentEndIndex && myResponseElement.get('elementId') === goTo.get('id')) {
          return index;
        }
        return carry;
      }, null);

      const response = this.state.response.update('answeredQuestions', (answeredQuestions) => {
        const before = answeredQuestions.slice(0, currentEndIndex + 1);
        const after = answeredQuestions.slice(currentEndIndex + 1);
        const repeated = answeredQuestions.slice(loopBackStartIndex, currentEndIndex + 1)
          .map(myResponseElement =>
            myResponseElement.set('id', cuid()).set('answers', fromJS([]))
          );
        return before.concat(repeated).concat(after);
      });
      return this.setState({
        response
      }, () => this.goToPage(currentEndIndex + 1));
    }
    return this.goToPage(currentEndIndex + 1);
  }

  handlePreviousPage() {
    const startIndex = parseInt(this.props.routeParams.startIndex, 10);
    // find last question, thats viewed
    const previousEndIndex = this.state.response.get('answeredQuestions').reduce((carry, responseElement, index) => {
      if (responseElement.get('viewed') && index < startIndex) {
        return index;
      }
      return carry;
    }, null);
    const previousStartIndex = this.getStartIndex(previousEndIndex);
    this.goToPage(previousStartIndex);
    // go to the last page, that was viewed
  }

  goToPage(startIndex) {
    const endIndex = this.getEndIndex(startIndex);
    const response = QuestionnaireForm.markPageAsViewedInResponse(
      startIndex,
      endIndex,
      this.state.response
    );
    this.setState({
      response
    });
    QuestionnaireForm.updateResponse(response.toJSON());
    hashHistory.push(`/users/${this.props.routeParams.userId}/questionnaires/${this.props.routeParams.questionnaireId}/start/${startIndex}/end/${endIndex}`);
  }

  handeSubmitQuestionnaire() {
    const response = this.state.response.set('completed', true);
    this.setState({
      response
    });
    // send to server
    QuestionnaireForm.updateResponse(response);
    hashHistory.push('/submitted');
  }

  render() {
    if (!this.state.questionnaire || !this.state.version || !this.state.response) {
      return <div className="container">Loading...</div>;
    }

    const startIndex = parseInt(this.props.routeParams.startIndex, 10);
    const endIndex = this.props.routeParams.endIndex ?
      parseInt(this.props.routeParams.endIndex, 10) :
      this.getEndIndex(startIndex);

    return (
      <div className="container">
        <h1 style={{ marginBottom: 32 }}>{this.state.version.get('title')}</h1>
        <div className="row">
          <div className="col-sm-3" />
          <div className="col-md-9">
            <Page
              responseElements={this.state.response.get('answeredQuestions').slice(startIndex, endIndex + 1)}
              version={this.state.version}
              onAnsweredQuestions={this.handleQuestionAnswered}
              onNextPage={this.handleNextPage}
              onPreviousPage={this.handlePreviousPage}
              showBackButton={parseInt(this.props.routeParams.startIndex, 10) !== 0}
              showNextButton={parseInt(this.props.routeParams.startIndex, 10) !== this.state.response.get('answeredQuestions').size}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default QuestionnaireForm;
