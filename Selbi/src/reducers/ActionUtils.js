
export default undefined;

export function getActionType(action) {
  if (action) {
    return action.type;
  }
  return 'no-action';
}
