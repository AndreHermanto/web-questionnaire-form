/**
  * Return the first defined value
  */
export function coalesce(first, ...rest) {
  return typeof first !== 'undefined'
  ? first
  : coalesce(...rest, null);
}
