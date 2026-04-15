import { ParsedPlace } from '@/types';

export const parseGoogleMapsURL = async (url: string): Promise<ParsedPlace | null> => {
  try {
    // Extract place ID from different Google Maps URL formats
    let placeId = null;

    // Format: https://maps.app.goo.gl/xxxxx
    const shortUrlMatch = url.match(/maps\.app\.goo\.gl\/(\w+)/);
    if (shortUrlMatch) {
      placeId = shortUrlMatch[1];
    }

    // Format: https://www.google.com/maps/place/.../@lat,lng,zoom,data=...
    const coordMatch = url.match(/@([\d.-]+),([\d.-]+)/);
    const lat = coordMatch ? parseFloat(coordMatch[1]) : undefined;
    const lng = coordMatch ? parseFloat(coordMatch[2]) : undefined;

    // Format: https://www.google.com/maps/place/Restaurant+Name/@...
    const nameMatch = url.match(/\/place\/([^/@]+)\//);
    let name = nameMatch ? decodeURIComponent(nameMatch[1]).replace(/\+/g, ' ') : null;

    // For short URLs, we would need to expand them to get full details
    // This is a simplified version that returns basic info
    if (!name && placeId) {
      // In a real implementation, you'd expand the short URL
      name = `Place (${placeId})`;
    }

    if (!name) {
      return null;
    }

    return {
      name,
      address: 'Google Maps Place',
      latitude: lat,
      longitude: lng,
      source: 'googlemaps',
      url,
    };
  } catch (error) {
    console.error('Error parsing Google Maps URL:', error);
    return null;
  }
};
