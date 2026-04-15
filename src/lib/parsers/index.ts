import { ParsedPlace, ParseURLResult } from '@/types';
import { parseTabelogURL } from './tabelog';
import { parseHotpepperURL } from './hotpepper';
import { parseGoogleMapsURL } from './googlemaps';

export const parseUrl = async (url: string): Promise<ParseURLResult> => {
  if (!url) {
    return {
      success: false,
      error: 'URL is empty',
    };
  }

  try {
    new URL(url);
  } catch {
    return {
      success: false,
      error: 'Invalid URL format',
    };
  }

  // Detect source and parse accordingly
  if (url.includes('tabelog.com')) {
    const place = await parseTabelogURL(url);
    if (place) {
      return { success: true, place };
    }
  } else if (url.includes('hotpepper.jp') || url.includes('hot-pepper')) {
    const place = await parseHotpepperURL(url);
    if (place) {
      return { success: true, place };
    }
  } else if (url.includes('google.com/maps') || url.includes('maps.app.goo.gl')) {
    const place = await parseGoogleMapsURL(url);
    if (place) {
      return { success: true, place };
    }
  }

  return {
    success: false,
    error: 'Unsupported URL source. Please use Tabelog, Hot Pepper, or Google Maps URLs.',
  };
};
