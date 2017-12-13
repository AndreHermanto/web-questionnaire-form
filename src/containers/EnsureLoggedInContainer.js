/**
Copy and paste this into your application
*/
import {
  authActions,
  authSelectors,
  EnsureLoggedIn
} from 'web-component-authentication';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  console.log('s', state.toJS());
  return {
    me: authSelectors.getCurrentUser(state)
  };
};

const mapDispatchToProps = dispatch => ({
  fetchMe: () => dispatch(authActions.fetchMe())
});

export default connect(mapStateToProps, mapDispatchToProps)(EnsureLoggedIn);
