import ImageReader from '@selbi/react-native-image-reader';
import FirebaseConnector from './FirebaseActions';

export default undefined;

export function createNewListingFromStore(newListing) {
  if (!newListing.imageUri) {
    return Promise.reject('Error loading image.');
  }

  return ImageReader
    .readImage(newListing.imageUri)
    .then((imageBase64) => FirebaseConnector.publishImage(
      imageBase64[0],
      newListing.imageHeight,
      newListing.imageWidth))
    .then((imageKey) => FirebaseConnector.createListing(
      newListing.title,
      '', // description
      newListing.price,
      {
        image1: {
          imageId: imageKey,
          width: newListing.imageWidth,
          height: newListing.imageHeight,
        },
      },
      '' // category
    ));
}
