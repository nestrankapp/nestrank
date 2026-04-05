export function createNearbyCandidatePoints(lat, lon, distanceMiles = 0.8) {
  const earthRadiusMiles = 3958.8;
  const angularDistance = distanceMiles / earthRadiusMiles;
  const bearings = [0, 45, 90, 135, 180, 225, 270, 315];

  return bearings.map((bearingDeg, index) => {
    const bearing = bearingDeg * Math.PI / 180;
    const lat1 = lat * Math.PI / 180;
    const lon1 = lon * Math.PI / 180;

    const lat2 = Math.asin(
      Math.sin(lat1) * Math.cos(angularDistance) +
      Math.cos(lat1) * Math.sin(angularDistance) * Math.cos(bearing)
    );

    const lon2 = lon1 + Math.atan2(
      Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(lat1),
      Math.cos(angularDistance) - Math.sin(lat1) * Math.sin(lat2)
    );

    return {
      id: `candidate-${index + 1}`,
      name: bearingLabel(bearingDeg),
      lat: lat2 * 180 / Math.PI,
      lon: lon2 * 180 / Math.PI,
      bearing: bearingDeg,
      distanceMiles
    };
  });
}

function bearingLabel(deg) {
  const labels = {
    0: 'North nearby area',
    45: 'Northeast nearby area',
    90: 'East nearby area',
    135: 'Southeast nearby area',
    180: 'South nearby area',
    225: 'Southwest nearby area',
    270: 'West nearby area',
    315: 'Northwest nearby area'
  };
  return labels[deg] || 'Nearby area';
}
