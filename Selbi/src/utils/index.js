
export default undefined;

export function isStringFloat(input) {
  const findFloatRegex = /^[0-9]*(\.[0-9]?[0-9]?)?$/;
  return !!input.match(findFloatRegex);
}


function toRadian(degree) {
  return (degree * Math.PI) / 180;
}

// Copied from http://stackoverflow.com/questions/13840516/how-to-find-my-distance-to-a-known-location-in-javascript
export function distanceInMilesString(pointOne, pointTwo) {
  const lat1 = pointOne.lat;
  const lon1 = pointOne.lon;
  const lat2 = pointTwo.lat;
  const lon2 = pointTwo.lon;

  const radiusOfEarchInKm = 6371;
  const dLat = toRadian(lat2 - lat1);
  const dLon = toRadian(lon2 - lon1);

  const sinHalfDLat = Math.sin(dLat / 2);
  const sinHalfDLon = Math.sin(dLon / 2);
  const a = (sinHalfDLat * sinHalfDLat)
    + (Math.cos(toRadian(lat1)) * Math.cos(toRadian(lat2)) * (sinHalfDLon * sinHalfDLon));
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distanceKm = radiusOfEarchInKm * c; // Distance in km
  const distanceMiles = distanceKm * 0.621371;

  if (distanceMiles < 1) {
    return '<1';
  }
  return distanceMiles.toFixed(0);
}


