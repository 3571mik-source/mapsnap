import { ParsedPlace } from '@/types';

export const parseHotpepperURL = async (url: string): Promise<ParsedPlace | null> => {
  try {
    // This would normally fetch and parse the actual HTML from Hot Pepper
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();

    // Extract restaurant name
    const nameMatch = html.match(/<h1[^>]*class="[^"]*name[^"]*"[^>]*>([n<]+)<\/h1>/);
    const name = nameMatch ? nameMatch[1].trim() : null;

    // Extract address
    const addressMatch = html.match(/住所[\s\S]*?<dd[^>]*>([^<]+)<\/dd>/);
    const address = addressMatch ? addressMatch[1].trim() : null;

    // Extract rating
    const ratingMatch = html.match(/平均点[\s]*(\d+\.\d+)/);
    const rating = ratingMatch ? parseFloat(ratingMatch[1]) : undefined;

    // Extract genre/cuisine
    const cuisineMatch = html.match(/ジャンル[^>]*>([^<]+)<\/a>/);
    const cuisine = cuisineMatch ? cuisineMatch[1].trim() : undefined;

    // Extract image if available
    const imageMatch = html.match(/<img[^>]*src="([^"]*photo[^"]*)"/);
    const imageUrl = imageMatch ? imageMatch[1] : undefined;

    if (!name || !address) {
      return null;
    }

    return {
      name,
      address,
      cuisine,
      rating,
      imageUrl,
      source: 'hotpepper',
      url,
    };
  } catch (error) {
    console.error('Error parsing Hot Pepper URL:', error);
    return null;
  }
};
