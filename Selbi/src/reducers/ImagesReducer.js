import { getActionType } from './ActionUtils';

const I_ADD_IMAGE = 'images-add-image';

export default function (imagesState = {}, action) {
  const newImagesState = Object.assign({}, imagesState);
  switch (getActionType(action)) {
    case I_ADD_IMAGE:
      newImagesState[action.key] = action.data;
      return newImagesState;
    default:
      return imagesState;
  }
}

export function storeImage(imageId, imageData) {
  return {
    type: I_ADD_IMAGE,
    key: imageId,
    data: imageData,
  };
}
