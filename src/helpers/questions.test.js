import { convertJsonLogicToText } from './questions';

describe('convertJsonLogicToText', () => {
  it('displays text', () => {
    const logic = {
      and: [{ '>': [3, 1] }, { '<': [1, 3] }]
    };
    const results = convertJsonLogicToText(logic);
    expect(results).toEqual('3 greater than 1 and, 1 less than 3');
  });
  it('handles vars', () => {
    const logic = { '>': [{ var: 'number' }, '1'] };
    const results = convertJsonLogicToText(logic);
    expect(results).toEqual('greater than 1');
  });
  it('handles vars and ands', () => {
    const logic = {
      and: [{ '>': [{ var: 'feet' }, '0'] }, { '<': [{ var: 'feet' }, '13'] }]
    };
    const results = convertJsonLogicToText(logic);
    expect(results).toEqual('greater than 0 and, less than 13');
  });
});
