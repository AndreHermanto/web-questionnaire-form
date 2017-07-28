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
    const consentTypeMappingId = '1';
    const consentTypeId = '1';
    const questionnaireId = '1';
    const versionId = '1';

    process.env.REACT_APP_BASE_URL = 'http://localhost:5000';
    fetchMock
      .get(`http://localhost:5000/consent-type-mappings?consentTypeId=1`, {
        body: {
          status: 200,
          data: [
            {
              id: consentTypeMappingId,
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
      {
        type: types.FETCH_CONSENT_TYPE_MAPPINGS_REQUEST
      },
      {
        type: types.FETCH_CONSENT_TYPE_MAPPINGS_SUCCESS,
        payload: {
          entities: {
            consentTypeMappings: {
              [consentTypeMappingId]: {
                id: consentTypeMappingId,
                questionnaires: [
                  { questionnaireId, versionPublished: versionId }
                ]
              }
            }
          },
          result: [consentTypeMappingId]
        }
      }
    ];
    const store = mockStore(
      fromJS({
        entities: {
          consentTypeMappings: {
            byId: {}
          }
        }
      })
    );

    return store
      .dispatch(actions.fetchConsentTypeMappings(consentTypeId))
      .then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
  });
});
