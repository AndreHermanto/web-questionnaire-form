import { getQuestionnaires } from './questionnaires';

test('getQuestionnaires works', () => {
  const state = { items: [] };
  expect(getQuestionnaires(state)).toEqual([]);
});
