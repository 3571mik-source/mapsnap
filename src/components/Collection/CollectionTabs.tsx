'use client';

import { useRef, useEffect } from 'react';
import { Collection } from '@/types';

interface CollectionTabsProps {
  collections: Collection[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export default function CollectionTabs({
  collections,
  selectedId,
  onSelect,
}: CollectionTabsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedId && scrollContainerRef.current) {
      const selectedTab = scrollContainerRef.current.querySelector(
        `[data-collection-id="${selectedId}"]`
      );
      if (selectedTab) {
        selectedTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedId]);

  return (
    <div
      ref={scrollContainerRef}
      className="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-hide"
    >
      {collections.map((collection) => (
        <button
          key={collection.id}
          data-collection-id={collection.id}
          onClick={() => onSelect(collection.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
            selectedId === collection.id
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span className="text-lg">{collection.emoji}</span>
          <span className="font-medium">{collection.name}</span>
        </button>
      ))}
    </div>
  );
}
