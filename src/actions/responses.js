export const fetchResponsesForConsentTypeId = consentTypeId => (
  dispatch,
  getState
) => {
  return {
    type: 'FETCH_RESPONSES_FOR_CONSENT_TYPE_ID',
    payload: consentTypeId
  };
};
