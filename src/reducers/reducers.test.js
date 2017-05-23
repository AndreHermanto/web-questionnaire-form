import mainReducer from '../reducers'

describe('mainReducer test', () => {
  it('should add the questionnaires list', () => {
    const questionnaires = [{creator:"ut,nostrum,qui", currentTitle:"Perspiciatis aut maiores quisquam maxime dolores sed.", 
      currentVersionId:"rJoYL2qxb", dateCreated:"Thu May 18 2017 05:08:35 GMT+1000 (AEST)",id:"5e3dd7b8-6ca3-4357-bc93-a2d453b81d62",
      lastUpdated:"Wed May 17 2017 18:44:55 GMT+1000 (AEST)",status:"qui,dolores,aut"}];
    expect(
      mainReducer({}, {
        type: 'FETCH_QUESTIONNAIRES_SUCCESS',
        payload: questionnaires
      }).questionnaires
    ).toEqual(questionnaires)
  })
  it('should return selected questionnaire', () => {
    const questionnaire = [{creator:"ut,nostrum,qui", currentTitle:"Perspiciatis aut maiores quisquam maxime dolores sed.", 
      currentVersionId:"rJoYL2qxb", dateCreated:"Thu May 18 2017 05:08:35 GMT+1000 (AEST)",id:"5e3dd7b8-6ca3-4357-bc93-a2d453b81d62",
      lastUpdated:"Wed May 17 2017 18:44:55 GMT+1000 (AEST)",status:"qui,dolores,aut"}];
    expect(
      mainReducer({}, {
        type: 'SET_SELECTED_QUESTIONNAIRE',
        questionnaire: questionnaire
      }).questionnaire
    ).toEqual(questionnaire)
  })
  it('should set new response to the questionnaire', () => {
    expect(
      mainReducer({}, {
        type: 'SET_RESPONSE',
        response: 'test response'
      }).response
    ).toEqual('test response')
  })
  it('should set new version to the questionnaire', () => {
    expect(
      mainReducer({}, {
        type: 'SET_VERSION',
        version: 'test version'
      }).version
    ).toEqual('test version')
  })
  it('should set isLoading to true', () => {
    expect(
      mainReducer({}, {
        type: 'FETCH_QUESTIONNAIRES_REQUEST'
      }).isLoading
    ).toEqual(true)
  })
  it('should set isLoading to false and isError to true', () => {
    expect(
      mainReducer({}, {
        type: 'FETCH_QUESTIONNAIRES_FAILURE'
      }).isLoading
    ).toEqual(false)
    expect(
      mainReducer({}, {
        type: 'FETCH_QUESTIONNAIRES_FAILURE'
      }).isError
    ).toEqual(true)
  })
})