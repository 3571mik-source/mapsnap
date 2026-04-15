'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="flex items-center justify-around h-20">
        <Link
          href="/map"
          className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors ${
            isActive('/map') ? 'text-blue-500' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <span className="text-2xl">🗺️</span>
          <span className="text-xs font-medium">Map</span>
        </Link>

        <Link
          href="/collections"
          className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors ${
            isActive('/collections') ? 'text-blue-500' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <span className="text-2xl">📚</span>
          <span className="text-xs font-medium">Collections</span>
        </Link>

        <Link
          href="/profile"
          className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors ${
            isActive('/profile') ? 'text-blue-500' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <span className="text-2xl">👤</span>
          <span className="text-xs font-medium">Profile</span>
        </Link>
      </div>
    </nav>
  );
}
