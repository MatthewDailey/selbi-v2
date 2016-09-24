
export default undefined;

export function isStringFloat(input) {
  const findFloatRegex = /^[0-9]*(\.[0-9]?[0-9]?)?$/;
  return !!input.match(findFloatRegex);
}
