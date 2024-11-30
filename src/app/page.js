'use client';
import { useState } from "react";
import axios from 'axios';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showMessage, setShowMessage] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [lastModifiedDate, setLastModifiedDate] = useState(null);

  const apiUrl = `https://eu.api.blizzard.com/profile/wow/character/ravencrest/${searchQuery}/statistics?namespace=profile-eu&locale=en_US`;

  const getAccessToken = async () => {
    try {
      const response = await axios.post('https://us.battle.net/oauth/token', null, {
        params: {
          grant_type: 'client_credentials',
        },
        auth: {
          username: process.env.NEXT_PUBLIC_BLIZZARD_CLIENT_ID,
          password: process.env.NEXT_PUBLIC_BLIZZARD_CLIENT_SECRET,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      return response.data.access_token;
    } catch (error) {
      console.error('Error fetching access token:', error.response || error.message);
      throw new Error('Failed to fetch access token');
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      setLoading(true);
      setErrorMessage("");

      try {
        const accessToken = await getAccessToken();

        const response = await axios.get(apiUrl, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        const lastModified = response.headers['last-modified'];
        const formattedDate = lastModified ? new Date(lastModified).toLocaleString() : "Unknown";
        setLastModifiedDate(formattedDate);

        if (response.data) {
          setSearchResult(response.data);
          const randomChoice = Math.random() < 0.5 ? "message1" : "message2";
          setShowMessage(randomChoice);
        } else {
          setErrorMessage("No data found for this character.");
        }
      } catch (error) {
        setErrorMessage("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
        setHasSearched(true);
      }
    }
  };

  const handleBack = () => {
    setSearchQuery("");
    setShowMessage(null);
    setSearchResult(null);
    setHasSearched(false);
    setErrorMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative flex justify-center items-center h-screen bg-gray-900">
      {!hasSearched && (
        <div className="flex flex-col items-center">
          <div className="text-5xl font-bold text-white mb-16">DID THEY QUEUE ANOTHER ONE?🤔</div>
          <div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
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
        </div>
      )}

      {hasSearched && (
        <div className="flex flex-col items-center mt-4">
          {loading && <div className="text-white">Loading...</div>}
          {errorMessage && (
            <div className="text-red-500 font-bold">{errorMessage}</div>
          )}

          {showMessage === "message1" && !loading && !errorMessage && (
            <div className="text-5xl font-bold text-white mt-4">
              <span className="text-green-400 uppercase">{searchResult?.character?.name}</span> QUEUED ANOTHER 😭
              <div className="mt-2 text-lg">Realm: {searchResult?.character?.realm?.name}</div>
              {lastModifiedDate && (
                <div className="mt-2 text-lg text-white">
                  Last Modified: {lastModifiedDate}
                </div>
              )}
            </div>
          )}
          {showMessage === "message2" && !loading && !errorMessage && (
            <div className="text-5xl font-bold text-white mt-4">
              <span className="text-red-400 uppercase">{searchResult?.character?.name}</span> RAGEQUIT 😆
              <div className="mt-2 text-lg">Realm: {searchResult?.character?.realm?.name}</div>
              {lastModifiedDate && (
                <div className="mt-2 text-lg text-white">
                  Last Modified: {lastModifiedDate}
                </div>
              )}
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
