'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { getCurrentUser, logOut } from '@/lib/firebase/auth';
import { getProfile, getCollections } from '@/lib/firebase/db';
import { Profile, Collection } from '@/types';
import BottomNav from '@/components/Layout/BottomNav';

export default function ProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const user = getCurrentUser();
      if (!user) {
        router.push('/login');
        return;
      }

      setUserId(user.uid);

      try {
        const [profileData, collectionsData] = await Promise.all([
          getProfile(user.uid),
          getCollections(user.uid),
        ]);

        setProfile(profileData);
        setCollections(collectionsData);
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  const handleLogOut = async () => {
    try {
      await logOut();
      toast.success('Signed out successfully');
      router.push('/login');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const publicCollections = collections.filter((c) => c.isPublic);

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
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        </div>
      </div>

      {/* Profile Section */}
      <div className="bg-white border-b border-gray-200 px-4 py-8">
        {profile && (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-4xl mx-auto mb-4">
              {profile.displayName.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{profile.displayName}</h2>
            <p className="text-gray-600 mt-1">@{profile.username}</p>
            {profile.bio && <p className="text-gray-600 mt-2">{profile.bio}</p>}

            {/* Stats */}
            <div className="flex gap-8 justify-center mt-6 pt-6 border-t border-gray-200">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {collections.length}
                </div>
                <p className="text-sm text-gray-600">Collections</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {profile.followerCount}
                </div>
                <p className="text-sm text-gray-600">Followers</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {profile.followingCount}
                </div>
                <p className="text-sm text-gray-600">Following</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Public Collections */}
      <div className="px-4 py-6 bottom-nav-spacing">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Public Collections</h3>
        {publicCollections.length === 0 ? (
          <p className="text-gray-600 text-center py-4">No public collections yet</p>
        ) : (
          <div className="space-y-3">
            {publicCollections.map((collection) => (
              <div key={collection.id} className="card p-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{collection.emoji}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">{collection.name}</h4>
                    {collection.description && (
                      <p className="text-sm text-gray-600">{collection.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 pb-24 space-y-3">
        <button
          onClick={() => router.push('/collections')}
          className="w-full py-3 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 font-medium hover:bg-gray-50 transition-colors"
        >
          Manage Collections
        </button>
        <button
          onClick={handleLogOut}
          className="w-full py-3 px-4 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
        >
          Sign Out
        </button>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </main>
  );
}
