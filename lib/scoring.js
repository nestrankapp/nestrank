export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function haversineMiles(lat1, lon1, lat2, lon2) {
  const toRad = deg => deg * Math.PI / 180;
  const R = 3958.8;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export function proximityScore(distance, targetMiles, floor = 0) {
  if (distance == null) return floor;
  return clamp(Math.round(100 - (distance / targetMiles) * 100), floor, 100);
}

export function categorizeFeatures(baseLat, baseLon, elements) {
  const buckets = {
    groceries: [], gas: [], medical: [], pharmacy: [], gym: [], coffee: [], restaurants: [], schools: [], parks: [], dogParks: [], golf: [], water: []
  };

  for (const el of elements || []) {
    const tags = el.tags || {};
    const lat = el.lat ?? el.center?.lat;
    const lon = el.lon ?? el.center?.lon;
    if (typeof lat !== 'number' || typeof lon !== 'number') continue;
    const distance = haversineMiles(baseLat, baseLon, lat, lon);
    const item = { distance, name: tags.name || 'Unnamed place', tags };

    if (tags.shop === 'supermarket') buckets.groceries.push(item);
    if (tags.amenity === 'fuel') buckets.gas.push(item);
    if (tags.amenity === 'hospital') buckets.medical.push(item);
    if (tags.amenity === 'pharmacy') buckets.pharmacy.push(item);
    if (tags.leisure === 'fitness_centre') buckets.gym.push(item);
    if (tags.amenity === 'cafe') buckets.coffee.push(item);
    if (tags.amenity === 'restaurant') buckets.restaurants.push(item);
    if (tags.amenity === 'school') buckets.schools.push(item);
    if (tags.leisure === 'park') buckets.parks.push(item);
    if (tags.leisure === 'dog_park') buckets.dogParks.push(item);
    if (tags.leisure === 'golf_course') buckets.golf.push(item);
    if (tags.natural === 'water') buckets.water.push(item);
  }

  Object.values(buckets).forEach(list => list.sort((a, b) => a.distance - b.distance));
  return buckets;
}

export function scoreFromBuckets(buckets) {
  const nearest = key => buckets[key][0]?.distance ?? null;
  const essentialScores = [
    proximityScore(nearest('groceries'), 1),
    proximityScore(nearest('gas'), 1.2, 10),
    proximityScore(nearest('medical'), 1.5, 10),
    proximityScore(nearest('pharmacy'), 1.2, 10),
    proximityScore(nearest('gym'), 1.5, 5),
    proximityScore(nearest('coffee'), 1.2, 5)
  ];

  const area = clamp(Math.round(essentialScores.reduce((a, b) => a + b, 0) / essentialScores.length), 0, 100);
  const schoolProximity = proximityScore(nearest('schools'), 2, 15);
  const schoolDensityBonus = clamp(buckets.schools.length * 8, 0, 25);
  const manualSchoolBaseline = 55;
  const schools = clamp(Math.round(manualSchoolBaseline * 0.65 + schoolProximity * 0.2 + schoolDensityBonus * 0.15), 0, 100);
  const outdoors = clamp(Math.round(
    proximityScore(nearest('parks'), 2, 10) * 0.45 +
    clamp(buckets.parks.length * 3, 0, 25) +
    clamp(buckets.dogParks.length * 7, 0, 15) +
    clamp(buckets.golf.length * 5, 0, 10) +
    clamp(buckets.water.length * 6, 0, 15)
  ), 0, 100);
  const food = clamp(Math.round(
    proximityScore(nearest('restaurants'), 1.5, 10) * 0.5 +
    clamp(buckets.restaurants.length * 2, 0, 40) +
    clamp(buckets.coffee.length * 3, 0, 15)
  ), 0, 100);

  return { area, schools, outdoors, food };
}

export function weightedTotal(scores, weights) {
  return Math.round(
    scores.area * weights.area +
    scores.schools * weights.schools +
    scores.outdoors * weights.outdoors +
    scores.food * weights.food
  );
}

export function normalizeWeights(weights) {
  const total = Object.values(weights).reduce((sum, value) => sum + value, 0);
  return Object.fromEntries(Object.entries(weights).map(([key, value]) => [key, value / total]));
}

export function summarizeMetrics(buckets, scores) {
  return [
    { title: 'Groceries', value: buckets.groceries[0] ? `${buckets.groceries[0].distance.toFixed(2)} mi` : 'N/A', note: 'Nearest supermarket' },
    { title: 'Schools', value: String(buckets.schools.length), note: 'Schools in search radius' },
    { title: 'Parks', value: String(buckets.parks.length), note: 'Parks in search radius' },
    { title: 'Restaurants', value: String(buckets.restaurants.length), note: 'Restaurants in search radius' },
    { title: 'Area score', value: String(scores.area), note: 'Convenience score' },
    { title: 'School score', value: String(scores.schools), note: 'School module score' },
    { title: 'Outdoor score', value: String(scores.outdoors), note: 'Outdoor access score' },
    { title: 'Food score', value: String(scores.food), note: 'Dining access score' }
  ];
}
