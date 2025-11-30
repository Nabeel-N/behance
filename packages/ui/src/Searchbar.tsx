"use client";

import { useState } from "react";

export default function Searchbar() {
  const [query, setQuery] = useState("");

  return (
    <div className="flex justify-center w-full px-4">
      {/* Updates:
          1. bg-gray-100 (Brighter than gray-200)
          2. focus-within:ring-blue-300 (More visible/brighter blue ring) 
      */}
      <div className="flex items-center w-full max-w-4xl bg-gray-100 rounded-full px-5 py-3 text-gray-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-300 transition-all duration-200 ease-in-out shadow-sm hover:bg-gray-200">
        {/* Search Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={3}
          stroke="currentColor"
          className="w-5 h-5 text-gray-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>

        {/* Input Field */}
        <input
          type="text"
          placeholder="Search"
          className="bg-transparent border-none outline-none w-full ml-3 text-gray-900 placeholder-gray-500 font-medium"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
    </div>
  );
}
