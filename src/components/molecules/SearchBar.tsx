// src/components/molecules/SearchBar.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <form onSubmit={handleSearch} className="flex items-center w-full max-w-xl">
      <input
        id="search-input"
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search"
        className="flex-1 rounded-l-full border border-gray-700 bg-gray-800 px-4 py-2 text-white text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none"
      />
      <button
        id="search-btn"
        type="submit"
        className="rounded-r-full border border-gray-700 border-l-0 bg-gray-700 px-4 py-2 hover:bg-gray-600 transition"
      >
        <Search className="h-4 w-4 text-gray-300" />
      </button>
    </form>
  );
}
