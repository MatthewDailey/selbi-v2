import ImageReader from '@selbi/react-native-image-reader';
import { publishImage, createListing, changeListingStatus, updateListing }
  from './FirebaseConnector';

export default undefined;

export function createNewListingFromStore(newListingData) {
  if (!newListingData.imageUri) {
    return Promise.reject('Error loading image.');
  }

  return ImageReader
    .readImage(newListingData.imageUri)
    .then((imageBase64) => publishImage(
      imageBase64[0],
      newListingData.imageHeight,
      newListingData.imageWidth))
    .then((imageKey) => createListing(
      newListingData.title,
      '', // description
      newListingData.price,
      {
        image1: {
          imageId: imageKey,
          width: newListingData.imageWidth,
          height: newListingData.imageHeight,
        },
      },
      '' // category
    ));
}

export function updateListingFromStore(listingId, newListingData) {
  return ImageReader
    .readImage(newListingData.imageUri)
    .then((imageBase64) => publishImage(
      imageBase64[0],
      newListingData.imageHeight,
      newListingData.imageWidth))
    .then((imageKey) => updateListing(
      listingId,
      newListingData.title,
      newListingData.description,
      newListingData.price,
      {
        image1: {
          imageId: imageKey,
          width: newListingData.imageWidth,
          height: newListingData.imageHeight,
        },
      }
    ));
}

export function makeListingPublic(listingData) {
  if (!listingData.listingId) {
    return Promise.reject('Need a listing id to make the listing public.');
  }
  if (!listingData.locationLat || !listingData.locationLon) {
    return Promise.reject('Public listings require geolocation');
  }

  return changeListingStatus(
    'public',
    listingData.listingId,
    [listingData.locationLat, listingData.locationLon]);
}

export function makeListingPrivate(listingData) {
  if (!listingData.listingId) {
    return Promise.reject('Need a listing id to make the listing private.');
  }

  return changeListingStatus(
    'private',
    listingData.listingId);
}