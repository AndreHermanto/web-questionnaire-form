import React, { Component } from 'react';

import { connect } from 'react-redux';
import toJS from '../components/toJS';
import * as selectors from '../reducers';
import TableOfContents from '../components/TableOfContents';

class TableOfContentsContainer extends Component {
  static propTyes: {
    responseElementId: PropTypes.string.isRequired
  };
  render() {
    return <TableOfContents {...this.props} />;
  }
}
function mapStateToProps(state, ownProps) {
  // get response element
  const responseElement = selectors.getResponseElementById(
    state,
    ownProps.responseElementId
  );
  if (!responseElement) {
    return {};
  }
  // get element
  const element = selectors.getElementById(
    state,
    responseElement.get('elementId')
  );

  return {
    element
  };
}

export default connect(mapStateToProps)(toJS(TableOfContentsContainer));
