/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
};

/**
 * Convert degrees to radians
 */
const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

/**
 * Format distance for display
 */
export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance}km`;
};

/**
 * Calculate estimated travel time by mode
 */
export const calculateTravelTime = (
  distance: number,
  mode: 'walking' | 'driving' | 'transit' = 'driving'
): number => {
  // Average speeds in km/h
  const speeds = {
    walking: 5,
    driving: 30, // City driving
    transit: 20, // Public transport
  };
  
  const timeInHours = distance / speeds[mode];
  return Math.round(timeInHours * 60); // Return minutes
};

/**
 * Format travel time for display
 */
export const formatTravelTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

/**
 * Get nearby turfs within a radius
 */
export const getTurfsWithinRadius = <T extends { location: { lat: number; lng: number } }>(
  turfs: T[],
  userLat: number,
  userLng: number,
  radiusKm: number = 10
): Array<T & { distance: number }> => {
  return turfs
    .map(turf => ({
      ...turf,
      distance: calculateDistance(userLat, userLng, turf.location.lat, turf.location.lng),
    }))
    .filter(turf => turf.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance);
};