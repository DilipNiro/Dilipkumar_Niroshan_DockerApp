import { useState } from 'react';
import './WatchlistItem.css';

const STATUS_OPTIONS = [
  { value: 'WATCHLIST', label: 'À voir' },
  { value: 'WATCHING', label: 'En cours' },
  { value: 'COMPLETED', label: 'Terminé' }
];

export const WatchlistItem = ({
  item,
  onStatusChange,
  onRemove,
  onMovieClick
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    if (newStatus === item.status) return;

    setLoading(true);
    setError(null);

    try {
      await onStatusChange(item.id, newStatus);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir retirer ce film de votre watchlist ?')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onRemove(item.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = () => {
    if (onMovieClick) {
      onMovieClick(item.movie);
    }
  };

  const getMovieImage = (movie) => {
    return movie.image || '/images/its-movie-time-vector.jpg';
  };

  const handleImageError = (e) => {
    e.target.src = '/images/its-movie-time-vector.jpg';
  };

  const getGenres = (movie) => {
    if (movie.genres && movie.genres.length > 0) {
      return movie.genres.map((mg) => {
        const genreName = mg.genre?.name || mg.genre || mg;
        return typeof genreName === 'string' ? genreName : null;
      }).filter(Boolean);
    }
    if (movie.genre) {
      return [movie.genre];
    }
    return [];
  };

  const renderRating = () => {
    const stars = Math.round(item.movie.rating / 2);
    return (
      <div className="watchlist-item__rating">
        <span className="watchlist-item__stars">
          {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
        </span>
        <span className="watchlist-item__rating-value">{item.movie.rating.toFixed(1)}/10</span>
      </div>
    );
  };

  return (
    <div className="watchlist-item">
      <div className="watchlist-item__image-wrapper" onClick={handleMovieClick}>
        <img
          src={getMovieImage(item.movie)}
          alt={item.movie.title}
          className="watchlist-item__image"
          onError={handleImageError}
        />
        <div className="watchlist-item__genre-badges">
          {getGenres(item.movie).length > 0 ? (
            getGenres(item.movie).map((genre, idx) => (
              <span key={idx} className="watchlist-item__genre-badge">
                {genre}
              </span>
            ))
          ) : null}
        </div>
      </div>

      <div className="watchlist-item__content">
        <h3 className="watchlist-item__title" onClick={handleMovieClick}>
          {item.movie.title}
        </h3>
        <p className="watchlist-item__meta">
          {item.movie.year} • {item.movie.duration} min • {item.movie.director}
        </p>

        {renderRating()}

        <p className="watchlist-item__description">{item.movie.description}</p>

        <div className="watchlist-item__controls">
          <select
            className="watchlist-item__status-select"
            value={item.status}
            onChange={handleStatusChange}
            disabled={loading}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            className="watchlist-item__remove-button"
            onClick={handleRemove}
            disabled={loading}
            aria-label="Retirer de la watchlist"
          >
            {loading ? '...' : '🗑️'}
          </button>
        </div>

        {error && <p className="watchlist-item__error">{error}</p>}
      </div>
    </div>
  );
};

