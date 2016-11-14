import RNFetchBlob from 'react-native-fetch-blob';
import ImageResizer from 'react-native-image-resizer';

import { createListing, changeListingStatus, updateListing, loadListingData,
  uploadFile } from './FirebaseConnector';

const Blob = RNFetchBlob.polyfill.Blob;

export default undefined;

function writeImageUriToFirebase(rnfbURI) {
  // create Blob from file path
  return Blob
    .build(RNFetchBlob.wrap(rnfbURI), { type: 'image/jpg;' })
    .then((blob) => uploadFile(blob));
}

function uploadThumbnailAndImage(imageUri, imageWidth, imageHeight) {
  if (!imageUri) {
    return Promise.reject('Error loading image.');
  }

  return ImageResizer.createResizedImage(
    imageUri,
      imageWidth / 4,
      imageHeight / 4,
    'JPEG',
    30)
    .then(writeImageUriToFirebase)
    .then((thumbnailUrl) =>
      writeImageUriToFirebase(imageUri)
        .then((fullUrl) => Promise.resolve({
          thumbnailUrl,
          imageUrl: fullUrl,
        })));
}

export function createNewListingFromStore(newListingData) {
  return uploadThumbnailAndImage(
      newListingData.imageUri,
      newListingData.imageWidth,
      newListingData.imageHeight)
    .then(({ thumbnailUrl, imageUrl }) => createListing(
      newListingData.title,
      '', // description
      newListingData.price,
      {
        image1: {
          url: imageUrl,
          thumbnailUrl,
          width: newListingData.imageWidth,
          height: newListingData.imageHeight,
        },
      },
      '' // category
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

export function updateListingFromStoreAndLoadResult(listingId, newListingData) {
  if (isNaN(newListingData.price)) {
    return Promise.reject('Price must be a number.');
  }

  let updateImagePromise = Promise.resolve();

  if (newListingData.imageUri
    && !newListingData.imageUri.startsWith('data:image/png;base64')
    && !newListingData.imageUri.startsWith('https://firebasestorage')) {
    updateImagePromise = uploadThumbnailAndImage(
      newListingData.imageUri,
      newListingData.imageWidth,
      newListingData.imageHeight)
      .then(({ thumbnailUrl, imageUrl }) => updateListing(
        listingId,
        newListingData.title,
        newListingData.description,
        newListingData.price,
        {
          image1: {
            url: imageUrl,
            thumbnailUrl,
            width: newListingData.imageWidth,
            height: newListingData.imageHeight,
          },
        }
      ));
  } else {
    updateImagePromise = updateListing(
      listingId,
      newListingData.title,
      newListingData.description,
      newListingData.price);
  }

  if (newListingData.status === 'public') {
    updateImagePromise = updateImagePromise
      .then(() => makeListingPublic(newListingData));
  } else {
    updateImagePromise = updateImagePromise
      .then(() => changeListingStatus(newListingData.status, newListingData.listingId));
  }

  return updateImagePromise
    .then(() => loadListingData(listingId));
}
