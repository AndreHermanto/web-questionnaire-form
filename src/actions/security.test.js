import { fromJS } from 'immutable';
import fetchMock from 'fetch-mock';
import * as securityActions from './security';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from '../reducers';

let store;

describe('decryptTokens', () => {
  beforeEach(() => {
    // for some reason, i have to do restore() to completely reset the mock
    fetchMock.restore();
    fetchMock.reset();
    store = createStore(
      reducer,
      applyMiddleware(thunk) // add logging in as middleware
    );
  });
  it('decrypts the tokens and stores them', () => {
    const userId = '1';
    const consentTypeId = '1';
    const timestamp = '1';
    const jwt = '1000';

    process.env.REACT_APP_BASE_URL = 'http://localhost:5000';
    fetchMock
      .post(`http://localhost:5000/secure/`, {
        status: 200,
        body: {
          userId,
          consentTypeId,
          timestamp,
          jwt
        }
      })
      .catch(unmatchedUrl => {
        // fallover call original fetch, because fetch-mock treats
        // any unmatched call as an error - its target is testing
        expect(unmatchedUrl).toBe(undefined);
      });

    return store
      .dispatch(securityActions.decryptTokens('asdf', 'sdfg', '1000'))
      .then(() => {
        // return of async actions
        expect(store.getState().get('ui')).toEqual(
          fromJS({
            failedToDecrypt: false,
            userId,
            consentTypeId,
            timestamp,
            jwt
          })
        );
      });
  });

  it('handles an invalid timestamp', () => {
    process.env.REACT_APP_BASE_URL = 'http://localhost:5000';
    fetchMock
      .post(`http://localhost:5000/secure/`, {
        status: 403
      })
      .catch(unmatchedUrl => {
        // fallover call original fetch, because fetch-mock treats
        // any unmatched call as an error - its target is testing
        expect(unmatchedUrl).toBe(undefined);
      });

    return store
      .dispatch(securityActions.decryptTokens('asdf', 'sdfg', '1000'))
      .catch(e => {
        expect(store.getState().get('ui')).toEqual(
          fromJS({
            failedToDecrypt: true
          })
        );
      });
  });
});
