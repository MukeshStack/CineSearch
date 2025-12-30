
import { useNavigate } from "react-router-dom";
import "./MovieCard.css";

export default function MovieCard({ movie }) {
  const navigate = useNavigate();

  function handleClick() {
    navigate(`/movie/${movie.imdbID}`);
  }

  return (
    <div className="movie-card" onClick={handleClick}>
      <div className="movie-poster">
        <img src={movie.Poster} alt={movie.Title} />
      </div>

      <h1 className="movie-title">{movie.Title}</h1>
      <p>Released in: {movie.Year}</p>
    </div>
  );
}
