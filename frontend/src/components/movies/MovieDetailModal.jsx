import { useState, useEffect } from 'react';
import './MovieDetailModal.css';

export const MovieDetailModal = ({
  movie,
  isOpen,
  onClose,
  onAddToWatchlist,
  isInWatchlist = false,
  showAddButton = true
}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAddToWatchlist = async () => {
    if (isInWatchlist || !onAddToWatchlist) return;

    setLoading(true);
    try {
      await onAddToWatchlist(movie.id);
    } catch (err) {
      console.error('Error adding to watchlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const getMovieImage = (movie) => {
    return movie.image || '/images/its-movie-time-vector.jpg';
  };

  const handleImageError = (e) => {
    e.target.src = '/images/its-movie-time-vector.jpg';
  };

  const renderRating = () => {
    const stars = Math.round(movie.rating / 2);
    return (
      <div className="movie-detail__rating">
        <span className="movie-detail__stars">
          {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
        </span>
        <span className="movie-detail__rating-value">{movie.rating.toFixed(1)}/10</span>
      </div>
    );
  };

  if (!isOpen || !movie) return null;

  return (
    <div className="movie-detail-modal" onClick={handleBackdropClick}>
      <div className="movie-detail-modal__content">
        <button className="movie-detail-modal__close" onClick={onClose}>
          ✕
        </button>

        <div className="movie-detail-modal__body">
          <div className="movie-detail__image-section">
            <img
              src={getMovieImage(movie)}
              alt={movie.title}
              className="movie-detail__image"
              onError={handleImageError}
            />
          </div>

          <div className="movie-detail__info-section">
            <h2 className="movie-detail__title">{movie.title}</h2>

            <div className="movie-detail__meta">
              <div className="movie-detail__genres">
                {movie.genres && movie.genres.length > 0 ? (
                  movie.genres.map((mg, idx) => {
                    const genreName = mg.genre?.name || mg.genre || mg;
                    return (
                      <span key={idx} className="movie-detail__genre-badge">
                        {genreName}
                      </span>
                    );
                  })
                ) : movie.genre ? (
                  <span className="movie-detail__genre-badge">{movie.genre}</span>
                ) : null}
              </div>
              <span className="movie-detail__year">{movie.year}</span>
              <span className="movie-detail__duration">{movie.duration} min</span>
            </div>

            {renderRating()}

            <div className="movie-detail__director">
              <strong>Réalisateur :</strong> {movie.director}
            </div>

            <div className="movie-detail__description">
              <h3>Synopsis</h3>
              <p>{movie.description}</p>
            </div>

            {showAddButton && onAddToWatchlist && (
              <button
                className={`movie-detail__add-button ${isInWatchlist ? 'movie-detail__add-button--disabled' : ''}`}
                onClick={handleAddToWatchlist}
                disabled={isInWatchlist || loading}
              >
                {loading ? 'Ajout...' : isInWatchlist ? 'Déjà dans la watchlist' : 'Ajouter à ma watchlist'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
