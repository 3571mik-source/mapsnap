'use client';

import { useState } from 'react';
import { GoogleMap, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { useJsApiLoader } from '@react-google-maps/api';
import { Place } from '@/types';

interface MapViewProps {
  places: Place[];
}

const DEFAULT_CENTER = { lat: 35.6762, lng: 139.6503 }; // Tokyo

export default function MapView({ places }: MapViewProps) {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  const calculateCenter = () => {
    if (places.length === 0) return DEFAULT_CENTER;

    const avgLat = places.reduce((sum, p) => sum + p.latitude, 0) / places.length;
    const avgLng = places.reduce((sum, p) => sum + p.longitude, 0) / places.length;

    return { lat: avgLat, lng: avgLng };
  };

  return (
    <GoogleMap
      mapContainerClassName="w-full h-full"
      center={calculateCenter()}
      zoom={12}
      options={{
        fullscreenControl: true,
        streetViewControl: false,
      }}
    >
      {places.map((place) => (
        <MarkerF
          key={place.id}
          position={{ lat: place.latitude, lng: place.longitude }}
          title={place.name}
          onClick={() => setSelectedPlace(place)}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: place.status === 'want' ? '#3b82f6' : '#22c55e',
            fillOpacity: 1,
            strokeColor: '#fff',
            strokeWeight: 2,
          }}
        />
      ))}

      {selectedPlace && (
        <InfoWindowF
          position={{
            lat: selectedPlace.latitude,
            lng: selectedPlace.longitude,
          }}
          onCloseClick={() => setSelectedPlace(null)}
        >
          <div className="bg-white rounded-lg p-4 max-w-xs">
            <h3 className="font-semibold text-gray-900 mb-1">{selectedPlace.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{selectedPlace.address}</p>
            <div className="flex gap-2">
              <span
                className={`text-xs font-medium px-2 py-1 rounded ${
                  selectedPlace.status === 'want'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {selectedPlace.status === 'want' ? 'Want' : 'Done'}
              </span>
            </div>
          </div>
        </InfoWindowF>
      )}
    </GoogleMap>
  );
}
