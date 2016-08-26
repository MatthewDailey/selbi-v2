import Immutable from 'immutable';

/*
 * Data necessary to create a new listing:
 * - image base64 (to be converted to /image/$imageId refs from firebase.
 * - sellerId
 * - latlon
 * - price
 * - title
 * - description
 */

/*
  const exampleNewListing = {
    status: 'building', // 'posting', 'posted'
    sellerUid: 'userUid',
    location: {
      lat: 12,
      lon: 12,
    },
    price: 12,
    title: 'twelveTitle',
    description: 'long form desc',
    image : {
      base64: base64Image1,
      height: 12,
      width: 12,
    }
  };
*/

const NL_SET_SELLER_UID = 'new-listing-set-seller-uid';
const NL_SET_PRICE = 'new-listing-set-price';
const NL_SET_TITLE = 'new-listing-set-title';
const NL_SET_DESCRIPTION = 'new-listing-set-description';
const NL_SET_LOCATION = 'new-listing-set-location';
const NL_SET_IMAGE_DIMENSIONS = 'new-listing-set-image-dimensions';
const NL_SET_IMAGE_URI = 'new-listing-set-image-local-uri';

class NewListing extends Immutable.Record({
  status: 'building',
  sellerUid: undefined,
  price: undefined,
  title: undefined,
  description: undefined,
  imageUri: undefined,
  imageHeight: undefined,
  imageWidth: undefined,
  locationLat: undefined,
  locationLon: undefined,
}) {}

function getActionType(action) {
  if (action) {
    return action.type;
  }
  return 'no-action';
}

export default function (futureListingState = new NewListing(), action) {
  switch (getActionType(action)) {
    case NL_SET_SELLER_UID:
      return futureListingState.merge({ sellerUid: action.sellerUid });
    case NL_SET_PRICE:
      return futureListingState.merge({ price: action.price });
    case NL_SET_TITLE:
      return futureListingState.merge({ title: action.title });
    case NL_SET_DESCRIPTION:
      return futureListingState.merge({ description: action.description });
    case NL_SET_LOCATION:
      return futureListingState.merge(
        { locationLat: action.location.lat, locationLon: action.location.lon });
    case NL_SET_IMAGE_DIMENSIONS:
      return futureListingState.merge({ imageHeight: action.height, imageWidth: action.width });
    case NL_SET_IMAGE_URI:
      return futureListingState.merge({ imageUri: action.imageUri });
    default:
      return futureListingState;
  }
}

export function setNewListingSeller(uid) {
  return {
    type: NL_SET_SELLER_UID,
    sellerUid: uid,
  };
}

export function setNewListingPrice(listingPrice) {
  return {
    type: NL_SET_PRICE,
    price: listingPrice,
  };
}

export function setNewListingTitle(listingTitle) {
  return {
    type: NL_SET_TITLE,
    title: listingTitle,
  };
}

export function setNewListingDescription(listingDescription) {
  return {
    type: NL_SET_DESCRIPTION,
    description: listingDescription,
  };
}

export function setNewListingLocation(listingLocation) {
  return {
    type: NL_SET_LOCATION,
    location: listingLocation,
  };
}

export function setNewListingImageDimensions(imageHeight, imageWidth) {
  return {
    type: NL_SET_IMAGE_DIMENSIONS,
    height: imageHeight,
    width: imageWidth,
  };
}

export function setNewListingImageLocalUri(imageLocalUri) {
  return {
    type: NL_SET_IMAGE_URI,
    imageUri: imageLocalUri,
  };
}
