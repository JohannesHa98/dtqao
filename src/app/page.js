'use client';
import { useState } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showMessage, setShowMessage] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const randomChoice = Math.random() < 0.5 ? "message1" : "message2";
      setSearchResult(searchQuery);
      setShowMessage(randomChoice);
      setHasSearched(true);
    }
  };

  const handleBack = () => {
    setSearchQuery("");
    setShowMessage(null);
    setSearchResult(null);
    setHasSearched(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative flex justify-center items-center h-screen bg-gray-900">
      {!hasSearched && (
        <div className="flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown} // Add event listener for "Enter"
            className="p-4 mr-2 w-96 rounded-md text-gray-900"
            placeholder="Search for a name..."
          />
          <button
            onClick={handleSearch}
            className="p-4 w-32 bg-purple-600 text-white rounded-md"
          >
            Search
          </button>
        </div>
      )}

      {hasSearched && (
        <div className="flex flex-col items-center mt-4">
          {showMessage === "message1" && (
            <div className="text-5xl font-bold text-white mt-4">
              <span className="text-green-400 uppercase">{searchResult}</span> QUEUED ANOTHER 😭
            </div>
          )}
          {showMessage === "message2" && (
            <div className="text-5xl font-bold text-white mt-4">
              <span className="text-red-400 uppercase">{searchResult}</span> RAGEQUIT 😆
            </div>
          )}

          <button
            onClick={handleBack}
            className="absolute top-8 right-8 p-4 w-32 bg-purple-600 text-white rounded-md"
          >
            BACK
          </button>
        </div>
      )}
    </div>
  );
}
