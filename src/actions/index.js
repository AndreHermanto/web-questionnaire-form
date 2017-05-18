/*
*action: addQuestionnaires to the form builder
*/
export function addQuestionnaires(questionnaires) {
  return {
    type: 'ADD_QUESTIONNAIRES',
    payload: questionnaires
  };
}
