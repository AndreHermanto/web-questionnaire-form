import { List } from 'immutable';

export const dedup = list =>
  list.reduce(
    (uniques, item) => uniques.concat(uniques.includes(item) ? [] : [item]),
    List()
  );
