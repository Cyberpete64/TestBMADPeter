export type GeoPoint = {
  latitude: number;
  longitude: number;
};

const EARTH_RADIUS_METERS = 6_371_000;

function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

export function getDistanceMeters(from: GeoPoint, to: GeoPoint) {
  const fromLatitude = toRadians(from.latitude);
  const toLatitude = toRadians(to.latitude);
  const latitudeDelta = toRadians(to.latitude - from.latitude);
  const longitudeDelta = toRadians(to.longitude - from.longitude);

  const halfChordLength =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(fromLatitude) *
      Math.cos(toLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;
  const angularDistance =
    2 * Math.atan2(Math.sqrt(halfChordLength), Math.sqrt(1 - halfChordLength));

  return EARTH_RADIUS_METERS * angularDistance;
}

export function formatDistanceMeters(distanceMeters: number) {
  return `${Math.round(distanceMeters)} m`;
}
