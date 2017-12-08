import { fromJS } from 'immutable';
import fetchMock from 'fetch-mock';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../actions/pricePlans';
import * as types from '../constants/pricePlanTypes';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const baseUrl = 'http://localhost:5000';

describe('fetching the price plans', () => {
  beforeAll(() => {
    process.env.REACT_APP_BASE_URL = baseUrl;
  });

  afterEach(() => {
    fetchMock.restore();
  });

  it('can handle array of objects from the server', () => {
    const pricePlanId = '1';
    fetchMock
      .get(`${baseUrl}/price-plans/${pricePlanId}/`, {
        body: {
          status: 200,
          data: [
            {
              id: pricePlanId,
              title: 'P1'
            }
          ]
        }
      })
      .catch(unmatchedUrl => {
        // fallover call original fetch, because fetch-mock treats
        // any unmatched call as an error - its target is testing
        expect(unmatchedUrl).toBe(undefined);
      });
    fetchMock.flush();
    const expectedActions = [
      { type: types.FETCH_PRICEPLANS_REQUEST },
      {
        payload: {
          entities: {
            pricePlans: {
              1: {
                id: pricePlanId,
                title: 'P1'
              }
            }
          },
          result: [pricePlanId]
        },
        type: types.FETCH_PRICEPLANS_SUCCESS
      }
    ];
    const store = mockStore(
      fromJS({
        entities: {
          pricePlans: {
            byId: {}
          }
        }
      })
    );
    return store.dispatch(actions.fetchPricePlan(pricePlanId)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('can handle a single object from the server', () => {
    const pricePlanId = '1';
    fetchMock
      .get(`${baseUrl}/price-plans/${pricePlanId}/`, {
        body: {
          status: 200,
          data: {
            id: pricePlanId,
            title: 'P1'
          }
        }
      })
      .catch(unmatchedUrl => {
        // fallover call original fetch, because fetch-mock treats
        // any unmatched call as an error - its target is testing
        expect(unmatchedUrl).toBe(undefined);
      });

    const expectedActions = [
      { type: types.FETCH_PRICEPLANS_REQUEST },
      {
        payload: {
          entities: {
            pricePlans: {
              1: {
                id: pricePlanId,
                title: 'P1'
              }
            }
          },
          result: [pricePlanId]
        },
        type: types.FETCH_PRICEPLANS_SUCCESS
      }
    ];
    const store = mockStore(
      fromJS({
        entities: {
          pricePlans: {
            byId: {}
          }
        }
      })
    );
    return store.dispatch(actions.fetchPricePlan(pricePlanId)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
