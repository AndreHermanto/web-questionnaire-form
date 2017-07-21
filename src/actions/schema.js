import { schema } from 'normalizr';

// consent types
export const consentType = new schema.Entity('consentTypes');
export const arrayOfConsentTypes = new schema.Array(consentType);
// consent type mappings
export const consentTypeMapping = new schema.Entity('consentTypeMappings');
export const arrayOfConsentTypeMappings = new schema.Array(consentTypeMapping);
// questionnaires
export const questionnaire = new schema.Entity('questionnaires');
export const arrayOfQuestionnaires = new schema.Array(questionnaire);

// answers
export const answer = new schema.Entity('answers');
export const arrayofAnswers = new schema.Array(answer);
// elements
export const element = new schema.Entity('elements', {
  answers: [answer]
});
export const arrayOfElements = new schema.Array(element);
// version
export const version = new schema.Entity('versions', {
  body: [element]
});
export const arrayOfVersions = new schema.Array(version);

// response element answers
export const responseElementAnswer = new schema.Entity(
  'responseElementAnswers'
);
// response element
export const responseElement = new schema.Entity('responseElements', {
  answers: [responseElementAnswer]
});
// response
export const response = new schema.Entity('responses', {
  answeredQuestions: [responseElement]
});
export const arrayOfResponses = new schema.Array(response);
