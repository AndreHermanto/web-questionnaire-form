import { fromJS } from 'immutable';
import fetchMock from 'fetch-mock';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../actions/consents';
import * as types from '../constants/ConsentTypes';

// setup a fake store - https://github.com/reactjs/redux/blob/master/docs/recipes/WritingTests.md#async-action-creators
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('fetching the consent type mapping', () => {
  afterEach(() => {
    fetchMock.reset();
  });
  it('grabs the data from the server', () => {
    const releaseId = '1';
    const consentTypeId = '1';
    const questionnaireId = '1';
    const versionId = '1';

    process.env.REACT_APP_BASE_URL = 'http://localhost:5000';
    fetchMock
      .get(`http://localhost:5000/releases?consentTypeId=1`, {
        body: {
          status: 200,
          data: [
            {
              id: consentTypeId,
              questionnaires: [{ questionnaireId, versionPublished: versionId }]
            }
          ]
        }
      })
      .catch(unmatchedUrl => {
        // fallover call original fetch, because fetch-mock treats
        // any unmatched call as an error - its target is testing
        expect(unmatchedUrl).toBe(undefined);
      });

    const expectedActions = [
      { type: 'FETCH_RELEASES_REQUEST' },
      {
        payload: {
          entities: {
            releases: {
              1: {
                id: '1',
                questionnaires: [
                  { questionnaireId: '1', versionPublished: '1' }
                ]
              }
            }
          },
          result: '1'
        },
        type: 'FETCH_RELEASES_SUCCESS'
      }
    ];
    const store = mockStore(
      fromJS({
        entities: {
          releases: {
            byId: {}
          }
        }
      })
    );

    return store.dispatch(actions.fetchReleases(consentTypeId)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
