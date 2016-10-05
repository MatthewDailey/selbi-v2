import { getActionType } from './ActionUtils';

const BB_SET_BULLETINS = 'bulletin-set';
const BB_CLEAR_BULLETINS = 'bulletin-clear';

export default function (priorState = {}, action) {
  switch (getActionType(action)) {
    case BB_SET_BULLETINS:
      console.log('Setting bulletins: ', action);
      return action.bulletins;
    case BB_CLEAR_BULLETINS:
      console.log('Clearing bulletins: ', action);
      return {};
    default:
      return priorState;
  }
}

export function setBulletins(bulletins) {
  return {
    type: BB_SET_BULLETINS,
    bulletins,
  };
}

export function clearBulletins() {
  return {
    type: BB_CLEAR_BULLETINS,
  };
}