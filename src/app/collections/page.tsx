'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { waitForUser } from '@/lib/firebase/auth';
import { getCollections, updateCollection } from '@/lib/firebase/db';
import { Collection } from '@/types';
import BottomNav from '@/components/Layout/BottomNav';
import CreateCollectionModal from 'A/components/Collection/CreateCollectionModal';

export default function CollectionsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await waitForUser();
      if (!user) {
        router.push('/login');
        return;
      }

      setUserId(user.uid);
      await loadCollections(user.uid);
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const loadCollections = async (uid: string) => {
    try {
      const data = await getCollections(uid);
      setCollections(data);
    } catch (error) {
      console.error('Error loading collections:', error);
      toast.error('Failed to load collections');
    }
  };

  const handleTogglePublic = async (collection: Collection) => {
    if (!userId) return;

    try {
      await updateCollection(userId, collection.id, {
        ...collection,
        isPublic: !collection.isPublic,
      });

      setCollections((prev) =>
        prev.map((c) => (c.id === collection.id ? { ...c, isPublic: !c.isPublic } : c))
      );

      toast.success(
        !collection.isPublic ? 'Collection is now public' : 'Collection is now private'
      );
    } catch (error) {
      toast.error('Failed to update collection');
    }
  };

  const handleShareCollection = (collection: Collection) => {
    if (!userId) return;

    const shareUrl = `${window.location.origin}/u/${userId}?collection=${collection.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Link copied to clipboard!');
  };

  if (isLoading) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Collections</h1>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
            >
              New
            </button>
          </div>
        </div>
      </div>

      {/* Collections List */}
      <div className="p-4 bottom-nav-spacing">
        {collections.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No collections yet</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              Create Your First Collection
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {collections.map((collection) => (
              <div key={collection.id} className="card p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-2xl mb-2">{collection.emoji}</div>
                    <h3 className="font-semibold text-lg text-gray-900">{collection.name}</h3>
                    {collection.description && (
                      <p className="text-sm text-gray-600 mt-1">{collection.description}</p>
                    )}
                  </div>
                  <div className="ml-4">
                    {collection.isPublic && (
                      <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-medium">
                        Public
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleTogglePublic(collection)}
                    className="flex-1 py-2 px-3 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {collection.isPublic ? 'Make Private' : 'Make Public'}
                  </button>
                  <button
                    onClick={() => handleShareCollection(collection)}
                    className="flex-1 py-2 px-3 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
                  >
                    Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Create Collection Modal */}
      {showCreateModal && (
        <CreateCollectionModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCollectionCreated={() => {
            setShowCreateModal(false);
            if (userId) loadCollections(userId);
          }}
        />
      )}
    </main>
  );
}
