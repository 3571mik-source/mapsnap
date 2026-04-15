'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { getCurrentUser } from 'A/lib/firebase/auth';
import { createPlace, createCollection } from 'A/lib/firebase/db';
import { enrichPlaceLocation } from 'A/lib/googlePlaces';
import { Collection, ParsedPlace } from '@/types';
import Modal from '@/components/UI/Modal';
import URLInput from './URLInput';

interface AddPlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  collections: Collection[];
  onPlaceAdded: () => void;
}

export default function AddPlaceModal({
  isOpen,
  onClose,
  collections,
  onPlaceAdded,
}: AddPlaceModalProps) {
  const [step, setStep] = useState<'url' | 'form'>('url');
  const [isLoading, setIsLoading] = useState(false);
  const [parsedPlace, setParsedPlace] = useState<ParsedPlace | null>(null);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [newCollectionEmoji, setNewCollectionEmoji] = useState('');
  const [newCollectionName, setNewCollectionName] = useState('');

  const handleURLParsed = async (url: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/parse-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (data.success && data.place) {
        // Enrich location if not already set
        if (!data.place.latitude || !data.place.longitude) {
          const coords = await enrichPlaceLocation(data.place.name, data.place.address);
          if (coords) {
            data.place.latitude = coords.latitude;
            data.place.longitude = coords.longitude;
          }
        }

        setParsedPlace(data.place);
        setStep('form');
      } else {
        toast.error(data.error || 'Failed to parse URL');
      }
    } catch (error) {
      toast.error('Error parsing URL');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePlace = async () => {
    const user = getCurrentUser();
    if (!user || !parsedPlace) return;

    if (selectedCollections.length === 0) {
      toast.error('Please select at least one collection');
      return;
    }

    setIsLoading(true);

    try {
      // Create new collection if needed
      let finalCollections = [...selectedCollections];

      if (newCollectionName && newCollectionEmoji) {
        const newCollectionId = await createCollection(
          user.uid,
          newCollectionName,
          newCollectionEmoji
        );
        finalCollections.push(newCollectionId);
      }

      // Create place
      await createPlace(user.uid, {
        name: parsedPlace.name,
        address: parsedPlace.address,
        latitude: parsedPlace.latitude || 0,
        longitude: parsedPlace.longitude || 0,
        status: 'want',
        collectionIds: finalCollections,
        photoIds: [],
        cuisine: parsedPlace.cuisine,
        rating: parsedPlace.rating,
        imageUrl: parsedPlace.imageUrl,
        source: parsedPlace.source,
        url: parsedPlace.url,
      });

      toast.success('Place added successfully!');
      onPlaceAdded();
      handleClose();
    } catch (error) {
      toast.error('Failed to add place');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep('url');
    setParsedPlace(null);
    setSelectedCollections([]);
    setNewCollectionEmoji('');
    setNewCollectionName('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Place">
      {step === 'url' ? (
        <URLInput onParsed={handleURLParsed} isLoading={isLoading} />
      ) : (
        <div className="space-y-6">
          {/* Parsed Info Preview */}
          {parsedPlace && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900">{parsedPlace.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{parsedPlace.address}</p>
            </div>
          )}

          {/* Existing Collections */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Add to Collections
            </label>
            <div className="space-y-2">
              {collections.length === 0 ? (
                <p className="text-sm text-gray-600">No collections yet. Create one below.</p>
              ) : (
                collections.map((collection) => (
                  <label
                    key={collection.id}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCollections.includes(collection.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCollections([...selectedCollections, collection.id]);
                        } else {
                          setSelectedCollections(
                            selectedCollections.filter((id) => id !== collection.id)
                          );
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-lg">{collection.emoji}</span>
                    <span className="text-gray-900">{collection.name}</span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Create New Collection */}
          <div className="border-t border-gray-200 pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Or Create New Collection
            </label>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Collection emoji (e.g., 🍜)"
                value={newCollectionEmoji}
                onChange={(e) => setNewCollectionEmoji(e.target.value)}
                className="input-base"
                maxLength={2}
              />
              <input
                type="text"
                placeholder="Collection name"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                className="input-base"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setStep('url')}
              className="flex-1 py-3 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 font-medium hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleCreatePlace}
              disabled={isLoading || selectedCollections.length === 0}
              className="flex-1 py-3 px-4 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Add Place'}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
