import React, { useState } from "react";
import "./App.css";

import { SongInterface } from "./type";

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResult, setSearchResult] = useState<SongInterface[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState();

  const searchSongs = async (term: string) => {
    try {
      const res = await fetch(
        `https://genius.p.rapidapi.com/search?q=${searchTerm}`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-host": "genius.p.rapidapi.com",
            "x-rapidapi-key":
              "4536126de6msh4930123a1a87c21p1e620ajsn29baca5b2d25",
          },
        }
      );

      if (!res.ok) {
        throw new Error(`This is an HTTP error: The status is ${res.status}`);
      }

      const data = await res.json();
      setSearchResult(data.response.hits);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setSearchTerm("");
    }
  };

  const songItem = searchResult.map((song) => {
    const url = song.result.url;

    return (
      <li key={song.result.id}>
        <span>
          <strong> {song.result.artist_names}</strong> - {song.result.title}
        </span>
        <button className="btn" onClick={() => window.open(url, "_blank")}>
          See More
        </button>
      </li>
    );
  });

  const submitHandler = (e: any): void => {
    e.preventDefault();

    if (!searchTerm) {
      alert("Please type in a search term");
    } else {
      searchSongs(searchTerm);
    }
  };

  return (
    <div>
      <header>
        <h1>Lyrics Search</h1>

        <form onSubmit={submitHandler}>
          <input
            type="text"
            placeholder="Enter artist or song name or lyrics..."
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
          <button type="submit">
            <i className="fa-solid fa-magnifying-glass"></i> Search
          </button>
        </form>
      </header>

      {!searchTerm && (
        <div className="container">
          <p>Search results will be displayed here</p>
        </div>
      )}

      {!searchResult && (
        <div className="container">
          <p>Sorry! There are no search results!</p>
        </div>
      )}

      {searchResult && (
        <div className="container">
          <ul className="songs">{songItem}</ul>
        </div>
      )}
    </div>
  );
};

export default App;
