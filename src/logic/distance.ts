
export const calcDistance = (origin: { lat: number, lng: number }, destination: { lat: number, lng: number }) => {
  return google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(origin.lat, origin.lng), new google.maps.LatLng(destination.lat, destination.lng));
}