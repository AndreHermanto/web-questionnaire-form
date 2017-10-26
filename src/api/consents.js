import * as rest from './rest';

export const getReleases = consentTypeId =>
  rest.get(
    `${process.env.REACT_APP_BASE_URL}/releases?consentTypeId=${consentTypeId}`
  );

export const getConsentTypeLandingPage = consentTypeId =>
  rest.get(
    `${process.env
      .REACT_APP_BASE_URL}/headingsData?consentTypeId=${consentTypeId}`
  );
