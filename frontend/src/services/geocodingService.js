/**
 * Geocoding service using OpenStreetMap Nominatim — restricted to India.
 * Converts place names → coordinates (lat/lon).
 *
 * API:  https://nominatim.openstreetmap.org/search?q=<search>&countrycodes=in&format=jsonv2&limit=5
 *
 * NOTE: Nominatim is the ONLY external API the frontend calls directly.
 * It is a free geocoding service and does not expose any secrets.
 * All routing / weather / AQI calls go through Spring Boot at localhost:8081.
 */

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';

/**
 * Search for Indian locations by query string.
 * Uses countrycodes=in to restrict results to India only.
 * Uses format=jsonv2 for richer response data.
 *
 * Returns an array of { displayName, shortName, lat, lon, type, category } results.
 */
export async function searchPlaces(query, limit = 5) {
  if (!query || query.trim().length < 2) return [];

  try {
    const url = `${NOMINATIM_BASE}/search?q=${encodeURIComponent(query.trim())}&countrycodes=in&format=jsonv2&limit=${limit}&addressdetails=1`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CleanRoute/1.0',
      },
    });

    if (!response.ok) throw new Error('Geocoding request failed');

    const data = await response.json();

    return data.map((item) => ({
      displayName: item.display_name,
      shortName: _buildShortName(item),
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      type: item.type || '',
      category: item.category || '',
    }));
  } catch (error) {
    console.error('[Geocoding Error]', error.message);
    return [];
  }
}

/**
 * Geocode a single Indian place name to coordinates.
 * Returns { lat, lon, displayName, shortName } or null.
 */
export async function geocodePlace(placeName) {
  if (!placeName || placeName.trim().length < 2) return null;

  const results = await searchPlaces(placeName, 1);
  if (results.length === 0) return null;

  return results[0];
}

/**
 * Reverse-geocode coordinates to a place name.
 * Returns { displayName, shortName, lat, lon } or null.
 */
export async function reverseGeocode(lat, lon) {
  try {
    const url = `${NOMINATIM_BASE}/reverse?lat=${lat}&lon=${lon}&format=jsonv2&addressdetails=1`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CleanRoute/1.0',
      },
    });

    if (!response.ok) return null;

    const item = await response.json();
    if (!item || item.error) return null;

    return {
      displayName: item.display_name,
      shortName: _buildShortName(item),
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
    };
  } catch {
    return null;
  }
}

/**
 * Build a short, human-readable Indian place name from Nominatim address details.
 * e.g. "Koti, Hyderabad, Telangana" or "HITEC City, Hyderabad, Telangana"
 */
function _buildShortName(item) {
  const addr = item.address || {};
  const parts = [];

  // Pick the most specific name available
  const name =
    addr.amenity ||
    addr.building ||
    addr.road ||
    addr.neighbourhood ||
    addr.suburb ||
    addr.village ||
    addr.town ||
    addr.city_district ||
    '';

  if (name) parts.push(name);

  // Add city / town
  const city = addr.city || addr.town || addr.village || addr.county || '';
  if (city && city !== name) parts.push(city);

  // Add state (important for Indian locations)
  const state = addr.state || '';
  if (state && !parts.includes(state)) parts.push(state);

  if (parts.length === 0) {
    // Fallback: first two comma-separated segments of display_name
    return item.display_name.split(',').slice(0, 2).join(',').trim();
  }

  return parts.join(', ');
}
