'use client';

import { useState } from 'react';
import { SearchBarProps } from '../../types';

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [term, setTerm] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (term.trim()) {
      onSearch(term.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <div className="flex-1 relative">
        <input
          type="text"
          placeholder="Search recipes by ingredient, cuisine, or dish name..."
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="input pr-10"
        />
        <svg
          className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <button
        type="submit"
        className="btn btn-primary btn-md px-6"
        disabled={!term.trim()}
      >
        <span className="mr-2">🔍</span>
        Search
      </button>
    </form>
  );
}
