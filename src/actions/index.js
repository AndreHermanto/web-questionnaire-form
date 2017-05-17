/*
*action: get questionnaires from form builder
*/
export function getQuestionnaires(questionnaires) {
  return {
    type: 'GET_QUESTIONNAIRES',
    data: questionnaires
  };
}