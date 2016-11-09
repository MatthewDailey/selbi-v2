
export default undefined;

export function isStringFloat(input) {
  const findFloatRegex = /^[0-9]*(\.[0-9]?[0-9]?)?$/;
  return !!input.match(findFloatRegex);
}

export function isStringInt(input) {
  const findFloatRegex = /^[0-9]*$/;
  return !!input.match(findFloatRegex);
}

function toRadian(degree) {
  return (degree * Math.PI) / 180;
}

export function toDollarString(price) {
  if (Number.isInteger(price)) {
    return `$${price}`;
  }
  return `$${price.toFixed(2)}`;
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

/*
 * Read the devices geolocation using React Native's navigator.geolocation
 *
 * @returns Promise fulfilled with { lat, lon } if successful. Rejected with a human readable error
 * otherwise.
 */
export function getGeolocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        // Code: 1 = permission denied, 2 = unavailable, 3 = timeout.
        if (error.code === 1) {
          reject('location permission error');
        } else {
          reject('Unable to read your location. Give it another shot in a sec.');
        }
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  });
}

export function watchGeolocation(handler) {
  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      handler({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      });
    });

  return () => navigator.geolocation.clearWatch(watchId);
}
