import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MovieDetail.css";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailer, setTrailer] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const TMDB_API_KEY = "cdfaee3fcd5fc7e052b21826b99dcab1";

  useEffect(() => {
    async function getData() {
      try {
        const movieRes = await fetch(
          `https://www.omdbapi.com/?apikey=f6de327f&i=${id}`
        );
        const movieData = await movieRes.json();

        if (movieData.Response === "True") {
          setMovie(movieData);

          const tmdbRes = await fetch(
            `https://api.themoviedb.org/3/find/${id}?api_key=${TMDB_API_KEY}&external_source=imdb_id`
          );
          const tmdbData = await tmdbRes.json();

          if (tmdbData.movie_results.length > 0) {
            const tmdbId = tmdbData.movie_results[0].id;

            const castRes = await fetch(
              `https://api.themoviedb.org/3/movie/${tmdbId}/credits?api_key=${TMDB_API_KEY}`
            );
            const castData = await castRes.json();
            setCast(castData.cast);

            const trailerRes = await fetch(
              `https://api.themoviedb.org/3/movie/${tmdbId}/videos?api_key=${TMDB_API_KEY}`
            );
            const trailerData = await trailerRes.json();

            const trailerVideo = trailerData.results.find(
              (v) => v.type === "Trailer" && v.site === "YouTube"
            );

            if (trailerVideo) {
              setTrailer(trailerVideo.key);
            }
          }
        } else {
          setError("Movie not found");
        }
      } catch (err) {
        setError("Something went wrong");
      }

      setLoading(false);
    }

    getData();
  }, [id]);

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
  if (error) return <p style={{ textAlign: "center" }}>{error}</p>;

  return (
    <>
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="movie-page">
        <div className="movie-top">
          <img src={movie.Poster} alt={movie.Title} />

          <div className="movie-info">
            <h1>{movie.Title}</h1>
            <p>{movie.Plot}</p>
            <p><b>Genre:</b> {movie.Genre}</p>
            <p><b>IMDb:</b> {movie.imdbRating}</p>
          </div>
        </div>

        {trailer && (
          <div className="trailer-box">
            <h2>Trailer</h2>
            <iframe
              src={`https://www.youtube.com/embed/${trailer}`}
              title="Trailer"
              allowFullScreen
            ></iframe>
          </div>
        )}

        <h2 className="cast-title">Cast</h2>

        <div className="cast-row">
          {cast.slice(0, 12).map((actor) => (
            <div className="cast-card" key={actor.id}>
              <img
                src={
                  actor.profile_path
                    ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                    : "https://via.placeholder.com/150"
                }
              />
              <p className="cast-name">{actor.name}</p>
              <span>{actor.character}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
