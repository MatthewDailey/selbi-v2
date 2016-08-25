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

const newListing = {
  status: 'building', // 'posting', 'posted'
  sellerId: 'userUid',
  location: {
    lat: 12,
    lon: 12,
  },
  price: 12,
  title: 'twelveTitle',
  description: 'long form desc',
};

const initialState = Immutable.Map({
  status: 'building',
});

export default function (futureListing = initialState, action) {
  return futureListing;
}
