import Immutable from 'immutable';
import { getActionType } from './ActionUtils';

const NL_SET_LISTING_ID = 'new-listing-set-id';
const NL_SET_PRICE = 'new-listing-set-price';
const NL_SET_TITLE = 'new-listing-set-title';
const NL_SET_DESCRIPTION = 'new-listing-set-description';
const NL_SET_LOCATION = 'new-listing-set-location';
const NL_SET_IMAGE_DIMENSIONS = 'new-listing-set-image-dimensions';
const NL_SET_IMAGE_URI = 'new-listing-set-image-local-uri';
const NL_SET_FROM_EXISTING_LISTING = 'new-listing-set-from-existing';
const NL_SET_STATUS = 'new-listing-set-status';
const NL_CLEAR_DATA = 'new-listing-clear-data';

class NewListing extends Immutable.Record({
  status: 'inactive',
  price: undefined,
  priceString: undefined,
  title: undefined,
  listingId: undefined,
  description: '',
  imageId: undefined,
  imageUri: undefined,
  imageHeight: undefined,
  imageWidth: undefined,
  locationLat: undefined,
  locationLon: undefined,
}) {}

export default function (futureListingState = new NewListing(), action) {
  switch (getActionType(action)) {
    case NL_SET_LISTING_ID:
      return futureListingState.merge({ listingId: action.listingId });
    case NL_SET_PRICE:
      return futureListingState.merge({ price: parseFloat(action.price),
        priceString: action.price });
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
    case NL_SET_STATUS:
      return futureListingState.merge({ status: action.status });
    case NL_SET_FROM_EXISTING_LISTING:
      return futureListingState.merge(action.data);
    case NL_CLEAR_DATA:
      return new NewListing();
    default:
      return futureListingState;
  }
}

export function setFromExistingListing(imageKey, imageData, listingKey, listingData) {
  return {
    type: NL_SET_FROM_EXISTING_LISTING,
    data: {
      imageId: imageKey,
      imageUri: `data:image/png;base64,${imageData.base64}`,
      imageHeight: imageData.height,
      imageWidth: imageData.width,
      listingId: listingKey,
      title: listingData.title,
      description: listingData.description,
      price: listingData.price,
      status: listingData.status,
    },
  };
}

export function setNewListingStatus(listingStatus) {
  return {
    type: NL_SET_STATUS,
    status: listingStatus,
  };
}

export function setNewListingId(id) {
  return {
    type: NL_SET_LISTING_ID,
    listingId: id,
  };
}

export function setNewListingPrice(listingPrice) {
  console.log(`Got price update ${listingPrice}`);
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

export function clearNewListing() {
  return {
    type: NL_CLEAR_DATA,
  };
}
