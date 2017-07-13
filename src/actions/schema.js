import { schema } from 'normalizr';

export const consentType = new schema.Entity('consentTypes');
export const arrayOfConsentTypes = new schema.Array(consentType);
export const consentTypeMapping = new schema.Entity('consentTypeMappings');
export const arrayOfConsentTypeMappings = new schema.Array(consentTypeMapping);

export const questionnaire = new schema.Entity('questionnaires');
export const arrayOfQuestionnaires = new schema.Array(questionnaire);
