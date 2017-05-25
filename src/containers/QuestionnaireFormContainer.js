import React, {
  Component
} from 'react';
import { connect } from 'react-redux';
import {
  hashHistory
} from 'react-router';
import { fromJS } from 'immutable';
import {
  setResponse,
  setupQuestionnaire,
  nextQuestion,
  setQuestionnaireDebug
} from '../actions';
import Question from '../components/Question';
import {
  getVisibleQuestions,
  isShowingSubmit
} from '../reducers';
import Heading from '../components/Heading';

class QuestionnaireFormContainer extends Component {

  constructor(props) {
    super(props);
    this.handleQuestionAnswered = this.handleQuestionAnswered.bind(this);
    this.handeSubmitQuestionnaire = this.handeSubmitQuestionnaire.bind(this);
    this.setPageMode = this.setPageMode.bind(this);
  }

  setPageMode() {
    if(this.props.location.query.showlogic === 'true') {
      this.props.dispatch(setQuestionnaireDebug(true));
    }
    else {
      this.props.dispatch(setQuestionnaireDebug(false));
    }
  }

  componentWillMount() {
    this.setPageMode();
  }

  componentDidMount() {
    const { questionnaireId, userId } = this.props.params;
    this.props.dispatch(setupQuestionnaire({ questionnaireId, userId }));
  }

  handleQuestionAnswered(responseElement) {
    // replace the answer with the new answer
    const response = this.props.response.update('answeredQuestions', responseElements =>
      fromJS(responseElements.reduce((carry, myResponseElement) => {
        if (myResponseElement.get('id') === responseElement.get('id')) {
          return [...carry, responseElement];
        }
        return [...carry, myResponseElement];
      }, [])));

    // store the change
    this.props.dispatch(setResponse(response));
  }

  handeSubmitQuestionnaire() {
    const response = this.props.response.set('completed', true);
    this.props.dispatch(setResponse(response));
    hashHistory.push('/submitted');
  }

  render() {
    if (!this.props.version || !this.props.response) {
      return <div className="container">Loading...</div>;
    }
    return (<div className="container">
      {this.props.visibleQuestions.map((visibleQuestion, index) => {
        const { element, responseElement } = visibleQuestion;
        if (!element || !responseElement) {
          return <div>Loading question and reponse...</div>;
        }
        if (element.get('type') === 'textinformation') {
          return (<div key={responseElement.get('id')} style={{ marginBottom: 24, backgroundColor: 'white', border: '1px solid #eee', padding: 32 }}>
            {element.get('text').split('\n').map(item => <span key={item}>{item}<br /></span>)}

            {index === this.props.visibleQuestions.size - 1 &&
            <button
              className="btn btn-primary btn-lg"
              onClick={() => this.props.dispatch(nextQuestion({ element }))}
            >
              {responseElement.get('answers').size ? 'Next' : 'Skip'}
            </button>
            }

          </div>);
        }

        // section heading
        if (element.get('type') === 'section') {
          return <div key={responseElement.get('id')}>
            <Heading text={element.get('title')} size={element.get('size')} />
            {index === this.props.visibleQuestions.size - 1 &&
            <button
              className="btn btn-primary btn-lg"
              onClick={() => this.props.dispatch(nextQuestion({ element }))}
            >
              Okay
            </button>
            }
          </div>
        }

        return (<div key={responseElement.get('id')}>
          <Question
            key={visibleQuestion.responseElement.get('id')}
            element={element}
            number={1}
            responseElement={responseElement}
            onAnswer={this.handleQuestionAnswered}
            showlogic={this.props.debug}
          />
          {index === this.props.visibleQuestions.size - 1 &&
            this.props.visibleQuestions.size !== this.props.response.get('answeredQuestions').size &&
          <button
            className="btn btn-primary btn-lg"
            onClick={() => this.props.dispatch(nextQuestion({ element }))}
          >
            {responseElement.get('answers').size ? 'Next' : 'Skip'}
          </button>
          }
        </div>
        );
      })}
        {this.props.isShowingSubmit &&
          <button className="btn btn-primary"
            onClick={this.handeSubmitQuestionnaire}>
            Submit
          </button>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const props = {
    response: state.responses.items.first(),
    version: state.versions.items.first(),
    visibleQuestions: getVisibleQuestions(state),
    isShowingSubmit: isShowingSubmit(state),
    debug: state.debug.debug
  };
  return props;
}

export default connect(mapStateToProps)(QuestionnaireFormContainer);
