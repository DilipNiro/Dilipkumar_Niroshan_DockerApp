import { useState } from 'react';
import './MovieCard.css';

export const MovieCard = ({
  movie,
  onMovieClick,
  showAddButton = true,
  onAddToWatchlist,
  isInWatchlist = false
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getMovieImage = (movie) => {
    return movie.image || '/images/its-movie-time-vector.jpg';
  };

  const handleImageError = (e) => {
    e.target.src = '/images/its-movie-time-vector.jpg';
  };

  const handleAddToWatchlist = async (e) => {
    e.stopPropagation();
    if (isInWatchlist || !onAddToWatchlist) return;

    setLoading(true);
    setError(null);

    try {
      await onAddToWatchlist(movie.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = () => {
    if (onMovieClick) {
      onMovieClick(movie);
    }
  };

  const renderRating = () => {
    const stars = Math.round(movie.rating / 2);
    return (
      <div className="movie-card__rating">
        <span className="movie-card__stars">
          {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
        </span>
        <span className="movie-card__rating-value">{movie.rating.toFixed(1)}/10</span>
      </div>
    );
  };

  return (
    <div className="movie-card" onClick={handleCardClick}>
      <div className="movie-card__image-wrapper">
        <img
          src={getMovieImage(movie)}
          alt={movie.title}
          className="movie-card__image"
          loading="lazy"
          onError={handleImageError}
        />
        <div className="movie-card__genre-badges">
          {movie.genres && movie.genres.length > 0 ? (
            movie.genres.map((mg, idx) => {
              const genreName = mg.genre?.name || mg.genre || mg;
              return (
                <span key={idx} className="movie-card__genre-badge">
                  {genreName}
                </span>
              );
            })
          ) : movie.genre ? (
            <span className="movie-card__genre-badge">{movie.genre}</span>
          ) : null}
        </div>
      </div>

      <div className="movie-card__content">
        <h3 className="movie-card__title">{movie.title}</h3>
        <p className="movie-card__year">{movie.year} • {movie.duration} min</p>
        <p className="movie-card__director">Réalisé par {movie.director}</p>
        <p className="movie-card__description">{movie.description}</p>

        {renderRating()}

        {showAddButton && (
          <button
            className={`movie-card__add-button ${isInWatchlist ? 'movie-card__add-button--disabled' : ''}`}
            onClick={handleAddToWatchlist}
            disabled={isInWatchlist || loading}
          >
            {loading ? 'Ajout...' : isInWatchlist ? 'Déjà dans la watchlist' : 'Ajouter à ma watchlist'}
          </button>
        )}

        {error && <p className="movie-card__error">{error}</p>}
      </div>
    </div>
  );
};
