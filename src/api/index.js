import * as rest from './rest';

export * from './consents';
export * from './payments';
export * from './pricePlansMapping';
export * from './pricePlans';

export const fetchQuestionnaire = questionnaireId =>
  rest.get(
    `${process.env.REACT_APP_BASE_URL}/questionnaires/${questionnaireId}`
  );

export const fetchResponses = (questionnaireId, userId) =>
  rest.get(
    `${process.env
      .REACT_APP_BASE_URL}/responses?questionnaireId=${questionnaireId}&userId=${userId}`
  );
export const fetchResponse = responseId =>
  rest.get(`${process.env.REACT_APP_BASE_URL}/responses/${responseId}`);

export const createResponse = response =>
  rest.post(`${process.env.REACT_APP_BASE_URL}/responses`, response);

export const fetchVersion = (questionnaireId, versionId) =>
  rest.get(
    `${process.env
      .REACT_APP_BASE_URL}/questionnaires/${questionnaireId}/versions/${versionId}`
  );

export const updateResponse = (responseId, response) =>
  rest.put(
    `${process.env.REACT_APP_BASE_URL}/responses/${responseId}`,
    response
  );

export const decryptTokens = (userId, consentTypeId, timestamp) => {
  return rest.post(`${process.env.REACT_APP_BASE_URL}/secure/`, {
    userId,
    consentTypeId,
    timestamp
  });
};
