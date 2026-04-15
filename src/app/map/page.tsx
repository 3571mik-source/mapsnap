'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import { waitForUser, getCurrentUser } from 'A/lib/firebase/auth';
import { getPlaces, getCollections } from 'A/lib/firebase/db';
import { Place, Collection } from 'A/types';
import CollectionTabs from '@/components/Collection/CollectionTabs';
import BottomNav from '@/components/Layout/BottomNav';
import AddPlaceModal from '@/components/Place/AddPlaceModal';

const MapView = dynamic(() => import('@/components/Map/MapView'), { ssr: false });

export default function MapPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [places, setPlaces] = useState<Place[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState:'map' | 'list'>('map');
  const [showAddModal, setShowAddModal] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await waitForUser();
      if (!user) {
        router.push('/login');
        return;
      }

      setUserId(user.uid);
      await loadData(user.uid);
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const loadData = async (uid: string) => {
    try {
      const [placesData, collectionsData] = await Promise.all([
        getPlaces(uid),
        getCollections(uid),
      ]);

      setPlaces(placesData);
      setCollections(collectionsData);

      if (collectionsData.length > 0) {
        setSelectedCollectionId(collectionsData[0].id);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    }
  };

  const filteredPlaces = selectedCollectionId
    ? places.filter((p) => p.collectionIds.includes(selectedCollectionId))
    : places;

  if (isLoading) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </main>
    );
  }

  return (
    <main className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-20">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">MapSnap</h1>
        </div>

        {/* Collection Tabs */}
        <CollectionTabs
          collections={collections}
          selectedId={selectedCollectionId}
          onSelect={setSelectedCollectionId}
        />
      </div>

      {/* View Mode Toggle */}
      <div className="border-b border-gray-200 flex gap-2 px-4 py-2">
        <button
          onClick={() => setViewMode('map')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            viewMode === 'map' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Map
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          List
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'map' ? (
          <MapView places={filteredPlaces} />
        ) : (
          <div className="overflow-y-auto h-full pb-24">
            <div className="p-4 space-y-3">
              {filteredPlaces.map((place) => (
                <div key={place.id} className="card p-4">
                  <h3 className="font-semibold text-gray-900">{place.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{place.address}</p>
                  <div className="flex gap-2 mt-3">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${
                        place.status === 'want' ? 'badge-want' : 'badge-done'
                      }`}
                    >
                      {place.status === 'want' ? 'Want' : 'Done'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors z-30"
      >
        <span className="text-2xl">+</span>
      </button>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Add Place Modal */}
      {showAddModal && (
        <AddPlaceModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          collections={collections}
          onPlaceAdded={() => {
            setShowAddModal(false);
            if (userId) loadData(userId);
          }}
        />
      )}
    </main>
  );
}
