import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getCurrentVersion } from '../reducers';
import QuestionnaireFormSubmitted from '../components/QuestionnaireFormSubmitted';

class QuestionnaireFormSubmittedContainer extends Component {
  constructor(props) {
    super(props);
    this.handleDisplayText = this.handleDisplayText.bind(this);
  }

  handleDisplayText(texts, fontSize, color, isItalic, isBold) {
    return texts.map((n, index) => {
      if (n !== '') {
        return (
          <p
            key={index}
            style={{
              margin: 0,
              maxWidth: 'none',
              fontSize: `${fontSize}px`,
              color: `${color}`,
              fontStyle: `${isItalic ? 'italic' : 'none'}`,
              fontWeight: `${isBold ? 'bold' : 'none'}`
            }}
          >
            {n}
          </p>
        );
      } else {
        return '';
      }
    });
  }

  render() {
    return (
      <QuestionnaireFormSubmitted
        version={this.props.version}
        displayText={this.handleDisplayText}
      />
    );
  }
}

function mapStateToProps(state, ownProps) {
  const props = {
    version: getCurrentVersion(state)
  };
  return props;
}

export default connect(mapStateToProps)(QuestionnaireFormSubmittedContainer);
