import { schema } from 'normalizr';

// consent types
export const consentType = new schema.Entity('consentTypes');
export const arrayOfConsentTypes = new schema.Array(consentType);

// releases

export const releases = new schema.Entity('releases');
export const arrayOfReleases = new schema.Array(releases);

// questionnaires
export const questionnaire = new schema.Entity('questionnaires');
export const arrayOfQuestionnaires = new schema.Array(questionnaire);

// answers
export const answer = new schema.Entity('answers');
export const arrayofAnswers = new schema.Array(answer);
// elements
const matrixElement = new schema.Entity('elements', { answers: [answer] });
export const element = new schema.Entity('elements', {
  answers: [answer],
  matrix: [matrixElement]
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

// payments
export const payments = new schema.Entity('payments');
export const arrayOfPayments = new schema.Array(payments);

// price Plans
export const pricePlans = new schema.Entity('pricePlans');
export const arrayOfPricePlans = new schema.Array(pricePlans);

// price Plans Mapping
export const pricePlansMapping = new schema.Entity('pricePlansMapping');
export const arrayOfPricePlansMapping = new schema.Array(pricePlansMapping);

// concepts
export const concepts = new schema.Entity(
  'concepts',
  {},
  { idAttribute: 'uri' }
);
export const arrayOfConcepts = new schema.Array(concepts);
