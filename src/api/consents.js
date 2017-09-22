import * as rest from './rest';

export const getConsentTypeMappings = consentTypeId =>
  rest.get(
    `${process.env.REACT_APP_BASE_URL}/consent-type-mappings?consentTypeId=${encodeURIComponent(consentTypeId)}`
  );
