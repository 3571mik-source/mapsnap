import { GooglePlacesResult } from '@/types';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export const geocodeAddress = async (
  address: string
): Promise<{ latitude: number; longitude: number } | null> => {
  if (!GOOGLE_MAPS_API_KEY) {
    console.error('Google Maps API key not configured');
    return null;
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`
    );

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        latitude: location.lat,
        longitude: location.lng,
      };
    }

    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
};

export const searchPlace = async (query: string): Promise<GooglePlacesResult[]> => {
  if (!GOOGLE_MAPS_API_KEY) {
    console.error('Google Maps API key not configured');
    return [];
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}`
    );

    const data = await response.json();

    if (data.results) {
      return data.results as GooglePlacesResult[];
    }

    return [];
  } catch (error) {
    console.error('Error searching places:', error);
    return [];
  }
};

export const enrichPlaceLocation = async (
  name: string,
  address: string
): Promise<{ latitude: number; longitude: number } | null> => {
  // First try to geocode the full address
  let coords = await geocodeAddress(address);

  // If that fails, try searching for the place name
  if (!coords) {
    const results = await searchPlace(`${name} ${address}`);
    if (results.length > 0 && results[0].geometry) {
      coords = {
        latitude: results[0].geometry.location.lat,
        longitude: results[0].geometry.location.lng,
      };
    }
  }

  return coords;
};
