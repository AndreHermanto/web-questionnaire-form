export * from './consents';

export const fetchQuestionnaire = questionnaireId =>
  fetch(`${process.env.REACT_APP_BASE_URL}/questionnaires/${questionnaireId}`);

export const fetchResponses = (questionnaireId, userId) =>
  fetch(
    `${process.env.REACT_APP_BASE_URL}/responses?questionnaireId=${questionnaireId}&userId=${userId}`
  );
export const fetchResponse = responseId =>
  fetch(`${process.env.REACT_APP_BASE_URL}/responses/${responseId}`);

export const createResponse = response =>
  fetch(`${process.env.REACT_APP_BASE_URL}/responses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(response)
  });

export const fetchVersion = (questionnaireId, versionId) =>
  fetch(
    `${process.env.REACT_APP_BASE_URL}/questionnaires/${questionnaireId}/versions/${versionId}`
  );

export const updateResponse = (responseId, response) =>
  fetch(`${process.env.REACT_APP_BASE_URL}/responses/${responseId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(response)
  });

export const decryptTokens = (userId, consentTypeId, timestamp) => {
  console.log('t', timestamp);
  return fetch(`${process.env.REACT_APP_BASE_URL}/secure/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId, consentTypeId, timestamp })
  });
};
