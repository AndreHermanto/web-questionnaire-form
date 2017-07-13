import { _get } from './rest';

export const getConsentTypeMappings = consentTypeId =>
  _get(
    `${process.env.REACT_APP_BASE_URL}/consent-type-mappings?consentTypeId=${consentTypeId}`
  );
