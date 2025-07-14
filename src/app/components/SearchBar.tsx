'use client';

import { useState } from 'react';

export default function SearchBar({ onSearch }: { onSearch: (term: string) => void }) {
  const [term, setTerm] = useState("");

  return (
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="Search recipes..."
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <button
        onClick={() => onSearch(term)}
        className="bg-blue-600 text-white px-4 rounded"
      >
        Search
      </button>
    </div>
  );
}
