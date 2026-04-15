export type PlaceStatus = 'want' | 'done';

export interface Place {
  id: string;
  userId: string;
  name: string;
  description?: string;
  address: string;
  latitude: number;
  longitude: number;
  status: PlaceStatus;
  collectionIds: string[];
  photoIds: string[];
  url?: string;
  cuisine?: string;
  rating?: number;
  imageUrl?: string;
  source?: 'tabelog' | 'hotpepper' | 'googlemaps' | 'manual';
  createdAt: Date;
  updatedAt: Date;
}

export interface Photo {
  id: string;
  userId: string;
  placeId: string;
  url: string;
  caption?: string;
  createdAt: Date;
}

export interface Collection {
  id: string;
  userId: string;
  name: string;
  emoji: string;
  description?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Profile {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  publicCollections: string[];
  followerCount: number;
  followingCount: number;
  createdAt: Date;
}

export interface ParsedPlace {
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  cuisine?: string;
  rating?: number;
  imageUrl?: string;
  source: 'tabelog' | 'hotpepper' | 'googlemaps' | 'manual';
  url: string;
}

export interface ParseURLResult {
  success: boolean;
  place?: ParsedPlace;
  error?: string;
}

export interface GooglePlacesResult {
  name: string;
  formatted_address: string;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
  photos?: Array<{
    photo_reference: string;
  }>;
  rating?: number;
  types?: string[];
  url?: string;
}
