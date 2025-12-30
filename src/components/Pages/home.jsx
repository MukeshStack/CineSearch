import { useState, useEffect } from "react";
import MovieCard from "../MovieCard";
import "./home.css";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [result, setResult] = useState([]);
  const [error, setError] = useState("");
  const [showSearchTerm, setShowSearchTerm] = useState("");

  useEffect(() => {
    const savedSearch = sessionStorage.getItem("searchResults");
    const savedText = sessionStorage.getItem("searchText");

    if (savedSearch && savedText) {
      setResult(JSON.parse(savedSearch));
      setShowSearchTerm(savedText);
      return;
    }

    const savedDefault = sessionStorage.getItem("defaultMovies");
    if (savedDefault) {
      setResult(JSON.parse(savedDefault));
      return;
    }

    const categories = ["action", "marvel", "batman", "avengers", "horror"];
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];

    async function loadDefaultMovies() {
      setLoading(true);

      const res = await fetch(
        `https://www.omdbapi.com/?apikey=f6de327f&s=${randomCategory}`
      );
      const data = await res.json();

      if (data.Response === "True") {
        setResult(data.Search);
        sessionStorage.setItem(
          "defaultMovies",
          JSON.stringify(data.Search)
        );
      }

      setLoading(false);
    }

    loadDefaultMovies();
  }, []);

  async function handleClick() {
    setLoading(true);
    setError("");
    setShowSearchTerm("");

    if (input === "") {
      setError("Please enter a movie name");
      setLoading(false);
      return;
    }

    const res = await fetch(
      `https://www.omdbapi.com/?apikey=f6de327f&s=${input}`
    );
    const data = await res.json();

    if (data.Response === "True") {
      setResult(data.Search);
      setShowSearchTerm(input);

      sessionStorage.setItem("searchResults", JSON.stringify(data.Search));
      sessionStorage.setItem("searchText", input);
    } else {
      setResult([]);
      setError("No results found");
    }

    setLoading(false);
  }

  return (
    <>
      <h1>Welcome to CineSearch</h1>
      <p>Search movies, explore cast and watch trailers.</p>

      <div className="search-box">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search movies or shows..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleClick();
            }}
          />
          <button onClick={handleClick} disabled={loading}>
            {loading ? "Working..." : "Search"}
          </button>
        </div>
      </div>

      {showSearchTerm && (
        <p className="searched-text">
          Showing results for: <b>{showSearchTerm}</b>
        </p>
      )}

      <div className="results-container">
        {result.map((item) => (
          <MovieCard key={item.imdbID} movie={item} />
        ))}
      </div>

      {error && <p>{error}</p>}

      <footer className="app-footer">
        <p>Built with ❤️ by Mukesh Kumar</p>
        <p className="small-text">Learning React • Movie Search App</p>
      </footer>
    </>
  );
}
