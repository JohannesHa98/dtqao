"use client";

import Image from "next/image";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedServer, setSelectedServer] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("eu");
  const [showMessage, setShowMessage] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [lastModifiedDate, setLastModifiedDate] = useState(null);
  const [randomImage, setRandomImage] = useState(null);

  const onlineImages = ["/minussocial.png"];

  const ragequitImages = ["/rest.png", "/knuckles.png"];

  const getRandomImage = (imageList) => {
    const randomIndex = Math.floor(Math.random() * imageList.length);
    return imageList[randomIndex];
  };

  const getAccessToken = async () => {
    try {
      const response = await axios.post(
        "https://us.battle.net/oauth/token",
        null,
        {
          params: {
            grant_type: "client_credentials",
          },
          auth: {
            username: process.env.NEXT_PUBLIC_BLIZZARD_CLIENT_ID,
            password: process.env.NEXT_PUBLIC_BLIZZARD_CLIENT_SECRET,
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      return response.data.access_token;
    } catch (error) {
      console.error(
        "Error fetching access token:",
        error.response || error.message
      );
      throw new Error("Failed to fetch access token");
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim() && selectedServer.trim()) {
      setLoading(true);
      setErrorMessage("");
      setRandomImage(getRandomImage(onlineImages));

      const apiUrl = `https://${selectedRegion}.api.blizzard.com/profile/wow/character/${selectedServer}/${searchQuery}/statistics?namespace=profile-${selectedRegion}&locale=en_US&timestamp=${Date.now()}`;

      try {
        const accessToken = await getAccessToken();

        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const lastModified = response.headers["last-modified"];
        const formattedDate = lastModified
          ? new Date(lastModified).toLocaleString()
          : "Unknown";
        setLastModifiedDate(formattedDate);

        if (response.data) {
          setSearchResult(response.data);

          if (lastModified) {
            const lastModifiedDate = new Date(lastModified);
            const now = new Date();
            const timeDifference = (now - lastModifiedDate) / (1000 * 60);

            if (timeDifference > 10) {
              setShowMessage("message1");
            } else {
              setShowMessage("message2");
            }
          } else {
            setShowMessage("message1");
          }
        } else {
          setErrorMessage("No data found for this character.");
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setErrorMessage("That guy does not seem to exist.");
        } else {
          setErrorMessage("Failed to fetch data. Please try again.");
        }
      } finally {
        setLoading(false);
        setHasSearched(true);
      }
    }
  };

  const handleBack = () => {
    setSearchQuery("");
    setSelectedServer("");
    setSelectedRegion("eu");
    setShowMessage(null);
    setSearchResult(null);
    setHasSearched(false);
    setErrorMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative flex justify-center items-center h-screen bg-gray-900">
      {!hasSearched && (
        <div className="flex flex-col items-center">
          <div className="text-5xl font-bold text-white mb-16">
            DID THEY QUEUE ANOTHER ONE?🤔
          </div>
          <div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="p-4 mr-2 w-80 rounded-md text-gray-900"
              placeholder="Character name"
            />
            <input
              type="text"
              value={selectedServer}
              onChange={(e) => setSelectedServer(e.target.value)}
              onKeyDown={handleKeyDown}
              className="p-4 mr-2 w-80 rounded-md text-gray-900"
              placeholder="Server name"
            />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="absolute top-8 left-8 p-4 w-20 bg-purple-600 text-white rounded-md hover:bg-purple-700 cursor-pointer"
            >
              <option value="eu">EU</option>
              <option value="us">US</option>
            </select>
            <button
              onClick={handleSearch}
              className="p-4 w-32 bg-purple-600 hover:bg-purple-700 text-white rounded-md"
            >
              SEARCH
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
              <span className="text-green-400 uppercase">
                {searchResult?.character?.name}
              </span>{" "}
              QUEUED ANOTHER 😭
              <div>
                <Image
                  src={randomImage}
                  alt="Online Image"
                  width={256}
                  height={256}
                  className="rounded-lg absolute right-72 transform rotate-[330deg]"
                />
              </div>
            </div>
          )}

          {showMessage === "message2" && !loading && !errorMessage && (
            <div className="text-5xl font-bold text-white mt-4">
              <span className="text-red-400 uppercase">
                {searchResult?.character?.name}
              </span>{" "}
              RAGEQUIT 😆
              {lastModifiedDate && (
                <div className="mt-2 text-lg text-white">
                  Last online: {lastModifiedDate}
                </div>
              )}
              <div>
                <Image
                  src={randomImage}
                  alt="Ragequit Image"
                  width={256}
                  height={256}
                  className="rounded-lg absolute right-72 transform rotate-[330deg]"
                />
              </div>
            </div>
          )}

          <button
            onClick={handleBack}
            className="absolute top-8 right-8 p-4 w-32 bg-purple-600 hover:bg-purple-700 text-white rounded-md"
          >
            BACK
          </button>
        </div>
      )}
    </div>
  );
}
