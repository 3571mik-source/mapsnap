'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

interface URLInputProps {
  onParsed: (url: string) => void;
  isLoading?: boolean;
}

const SUPPORTED_SOURCES = [
  { name: 'Tabelog', pattern: 'tabelog.com', color: 'bg-red-100 text-red-700' },
  { name: 'Hot Pepper', pattern: 'hotpepper.jp', color: 'bg-orange-100 text-orange-700' },
  { name: 'Google Maps', pattern: 'google.com/maps', color: 'bg-blue-100 text-blue-700' },
];

export default function URLInput({ onParsed, isLoading = false }: URLInputProps) {
  const [url, setUrl] = useState('');

  const detectSource = (inputUrl: string) => {
    return SUPPORTED_SOURCES.find((source) => inputUrl.includes(source.pattern));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    const source = detectSource(url);
    if (!source) {
      toast.error('Please use Tabelog, Hot Pepper, or Google Maps URLs');
      return;
    }

    try {
      const response = await fetch('/api/parse-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (data.success) {
        onParsed(url);
        setUrl('');
      } else {
        toast.error(data.error || 'Failed to parse URL');
      }
    } catch (error) {
      toast.error('Error parsing URL');
    }
  };

  const source = detectSource(url);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Restaurant URL
        </label>
        <input
          type="url"
          placeholder="Paste Tabelog, Hot Pepper, or Google Maps URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="input-base"
          disabled={isLoading}
        />
      </div>

      {url && (
        <div className="space-y-2">
          <p className="text-xs text-gray-600">Supported sources:</p>
          <div className="flex flex-wrap gap-2">
            {SUPPORTED_SOURCES.map((s) => (
              <span
                key={s.name}
                className={`text-xs font-medium px-3 py-1 rounded-full transition-all ${
                  source?.name === s.name
                    ? s.color
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {s.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || !url}
        className="w-full py-3 px-4 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Parsing...' : 'Continue'}
      </button>
    </form>
  );
}
