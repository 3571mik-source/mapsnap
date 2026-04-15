'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { getCurrentUser } from 'A/lib/firebase/auth';
import { createCollection } from '@/lib/firebase/db';
import Modal from '@/components/UI/Modal';

const EMOJI_SUGGESTIONS = ['🍜', '🍕', '🍱', '🍛', '🍲', '🥘', '🍣', '☕', '🍰', '🍦'];

interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCollectionCreated: () => void;
}

export default function CreateCollectionModal({
  isOpen,
  onClose,
  onCollectionCreated,
}: CreateCollectionModalProps) {
  const [emoji, setEmoji] = useState('🍜');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Collection name is required');
      return;
    }

    const user = getCurrentUser();
    if (!user) {
      toast.error('User not authenticated');
      return;
    }

    setIsLoading(true);

    try {
      await createCollection(user.uid, name, emoji);
      toast.success('Collection created successfully!');

      // Reset form
      setEmoji('🍜');
      setName('');
      setDescription('');
      setIsPublic(false);

      onCollectionCreated();
      onClose();
    } catch (error) {
      toast.error('Failed to create collection');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Collection">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Emoji Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Emoji
          </label>
          <div className="grid grid-cols-5 gap-2 mb-4">
            {EMOJI_SUGGESTIONS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setEmoji(e)}
                className={`text-3xl py-3 rounded-lg border-2 transition-colors ${
                  emoji === e
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Or enter custom emoji"
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            className="input-base text-center text-2xl"
            maxLength={2}
          />
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Collection Name
          </label>
          <input
            type="text"
            placeholder="e.g., Ramen Shops, Dessert Spots"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-base"
            required
            disabled={isLoading}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (optional)
          </label>
          <textarea
            placeholder="Describe this collection..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-base min-h-24"
            disabled={isLoading}
          />
        </div>

        {/* Public Toggle */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="rounded"
            disabled={isLoading}
          />
          <span className="text-gray-900">Make collection public</span>
        </label>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 py-3 px-4 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  
