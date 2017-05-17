import { connect } from 'react-redux'
import QuestionnaireAdmin from '../questionnaires/QuestionnaireAdminContainer'

// store state in selected component
const mapStateToProps = (state) => {
  return {
    questionnaires: state
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch
  }
}

const QuestionnaireAdminContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(QuestionnaireAdmin)

export default QuestionnaireAdminContainer