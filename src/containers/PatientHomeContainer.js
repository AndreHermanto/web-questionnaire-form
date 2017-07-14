import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  fetchQuestionnaires,
  setResume,
  fetchConsentTypeMappings,
  fetchDataForHomepage
} from '../actions';

import QuestionnaireDashboard from '../components/QuestionnaireDashboard';
import Footer from '../components/Footer';
import { getQuestionnaires, getHomepageQuestionnaires } from '../reducers';

class PatientHomeContainer extends Component {
  constructor(props) {
    super(props);
    this.handleChangeResume = this.handleChangeResume.bind(this);
  }
  componentDidMount() {
    // get out consent type
    // load consent type mapping
    // const consentTypeId = '83ffdd60-5098-49f6-8f77-635293df18e4';
    // const userId = 'admin';
    const { userId, consentTypeId } = this.props.params;
    this.props.dispatch(fetchDataForHomepage(consentTypeId, userId));
    // get the questionnaire
    // load that
    // fetch responses for consent type id
    // fetch versions for those responses
    // this.props.dispatch(fetchQuestionnaires());
  }
  handleChangeResume() {
    this.props.dispatch(setResume(!this.props.resume));
  }
  render() {
    const { questionnaires } = this.props;
    const { userId } = this.props.params;
    return (
      <div>
        <QuestionnaireDashboard items={questionnaires} userId={userId} />
        <Footer />
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { userId, consentTypeId } = ownProps.params;
  const questionnaires = getHomepageQuestionnaires(
    state,
    consentTypeId,
    userId
  );
  return {
    questionnaires
  };
}

export default connect(mapStateToProps)(PatientHomeContainer);
